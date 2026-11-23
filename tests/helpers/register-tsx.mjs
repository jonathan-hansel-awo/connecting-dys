import { registerHooks } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import ts from "typescript";

// Execute the actual TSX with the installed compiler; no test-only UI copies.
// Scoped to the DOM test process. Ordinary .ts modules use Node's existing loader.
export function registerTsx({ pathname } = {}) {
  return registerHooks({
    resolve(specifier, context, nextResolve) {
      if (pathname !== undefined && specifier === "next/navigation") return {
        url: `data:text/javascript,${encodeURIComponent(`export const usePathname = () => ${JSON.stringify(pathname)};`)}`,
        shortCircuit: true,
      };
      // Node ESM needs the extension for Next's documented package entry.
      if (specifier === "next/dynamic" || specifier === "next/link") return nextResolve(`${specifier}.js`, context);
      if (specifier.startsWith("@/")) {
        for (const extension of [".ts", ".tsx"]) {
          const url = new URL(`../../src/${specifier.slice(2)}${extension}`, import.meta.url);
          if (existsSync(url)) return nextResolve(url.href, context);
        }
      }
      return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
      if (!url.endsWith(".tsx")) return nextLoad(url, context);
      const { outputText } = ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
        fileName: url,
      });
      return { format: "module", source: outputText, shortCircuit: true };
    },
  });
}
