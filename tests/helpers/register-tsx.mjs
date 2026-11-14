import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Execute the actual TSX with the installed compiler; no test-only UI copies.
// Scoped to the DOM test process. Ordinary .ts modules use Node's existing loader.
export function registerTsx() {
  return registerHooks({
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
