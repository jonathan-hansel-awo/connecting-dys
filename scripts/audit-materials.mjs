// Source/HTTP evidence only. This does not substitute for rendered browser QA.
// Usage: node scripts/audit-materials.mjs /path/to/built/reference-checkout [output.json]
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { JSDOM } from 'jsdom';

const reference = process.argv[2];
const output = process.argv[3] || 'docs/baselines/phase-01/source-http-audit.json';
assert.ok(reference, 'Pass a built reference checkout as the first argument');
const routes = ['', 'about', 'support', 'contact', 'get-involved', 'accessibility', 'dyslexia', 'dyspraxia', 'dyscalculia', 'dysgraphia'];
const semantic = (html) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const main = doc.querySelector('main').cloneNode(true);
  main.querySelectorAll('script,svg,[aria-hidden="true"]').forEach((el) => el.remove());
  const result = {
    text: main.textContent.replace(/\s+/g, ' ').trim(),
    links: [...doc.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
    images: [...doc.images].map((i) => ({ alt: i.alt, src: i.getAttribute('src') })),
  };
  dom.window.close();
  return result;
};
const size = (directory, extension) => {
  const files = fs.readdirSync(directory, { recursive: true }).map((p) => path.join(directory, p)).filter((p) => p.endsWith(extension) && fs.statSync(p).isFile());
  return { files: files.length, rawBytes: files.reduce((sum, p) => sum + fs.statSync(p).size, 0), gzipBytes: files.reduce((sum, p) => sum + gzipSync(fs.readFileSync(p)).length, 0) };
};
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3201'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverLog = '';
server.stdout.on('data', (b) => { serverLog += b; });
server.stderr.on('data', (b) => { serverLog += b; });
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { if ((await fetch('http://127.0.0.1:3201/')).ok) { ready = true; break; } } catch { /* Startup only. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  assert.ok(ready, serverLog);
  const pages = [];
  for (const route of routes) {
    const response = await fetch(`http://127.0.0.1:3201/${route}`);
    const current = semantic(await response.text());
    const previous = semantic(fs.readFileSync(path.join(reference, '.next/server/app', `${route || 'index'}.html`), 'utf8'));
    assert.equal(response.status, 200);
    assert.deepEqual(current, previous, `Main content, navigation and image parity: /${route}`);
    pages.push({ route: `/${route}`, status: response.status, mainContentIdentical: true, allLinksIdentical: true, imagesIdentical: true });
  }
  const texture = await fetch('http://127.0.0.1:3201/textures/fine-paper.svg');
  assert.equal(texture.status, 200);
  assert.ok(texture.headers.get('content-type').includes('image/svg+xml'));
  const report = {
    generatedAt: new Date().toISOString(), reference: execFileSync('git', ['-C', reference, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), pages,
    texture: { status: texture.status, contentType: texture.headers.get('content-type'), bytes: fs.statSync('public/textures/fine-paper.svg').size, gzipBytes: gzipSync(fs.readFileSync('public/textures/fine-paper.svg')).length },
    assets: ['connecting_dys_logo.png', 'connecting-dys-embrace.png'].map((name) => ({ name, sha256: createHash('sha256').update(fs.readFileSync(`public/brand/${name}`)).digest('hex') })),
    productionStaticAssets: Object.fromEntries(['.js', '.css'].map((ext) => [ext, { before: size(path.join(reference, '.next/static'), ext), after: size('.next/static', ext) }])),
    sourceSurfaceCss: { bytes: fs.statSync('src/styles/surfaces.css').size, gzipBytes: gzipSync(fs.readFileSync('src/styles/surfaces.css')).length },
    scope: 'Byte counts are totals over all built static chunks, not page transfer, LCP/CLS or a performance score. HTTP/semantic checks do not render CSS or execute client scripts.',
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally {
  server.kill('SIGTERM');
}
