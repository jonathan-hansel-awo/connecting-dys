import { copyFile, rm } from "node:fs/promises";
const assets = [
  ["tests/fixtures/browser-qa.html", "public/__qa.html"],
  ["node_modules/axe-core/axe.min.js", "public/__qa-axe.js"],
];
for (const [source, dest] of assets) {
  if (process.argv.includes("--clean")) await rm(dest, { force: true });
  else await copyFile(source, dest);
}
console.log(
  process.argv.includes("--clean")
    ? "Removed browser QA assets."
    : "Open /__qa.html in the local development preview. Width, height, path and no-JavaScript options are available.",
);
