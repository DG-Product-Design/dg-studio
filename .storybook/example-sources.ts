import ts from "typescript";
import type { Plugin } from "vite";

/** Extract a demo and the declarations it uses, without unrelated demos or tests. */
export function extractExampleSources(
  filename: string,
): Record<string, string> {
  const program = ts.createProgram([filename], {
    noResolve: true,
    noLib: true,
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.Latest,
  });
  const source = program.getSourceFile(filename);
  if (!source) throw new Error(`Cannot read example source: ${filename}`);
  const checker = program.getTypeChecker();
  const printer = ts.createPrinter();
  const roots = source.statements.flatMap<{ name: string; statement: ts.Statement }>((statement) => {
    if (ts.isFunctionDeclaration(statement) && statement.name) {
      return [{ name: statement.name.text, statement }];
    }
    if (ts.isVariableStatement(statement)) {
      return statement.declarationList.declarations.flatMap((declaration) =>
        ts.isIdentifier(declaration.name) &&
        declaration.initializer &&
        (ts.isArrowFunction(declaration.initializer) ||
          ts.isFunctionExpression(declaration.initializer))
          ? [{ name: declaration.name.text, statement }]
          : [],
      );
    }
    return [];
  });

  return Object.fromEntries(
    roots.map(({ name, statement }) => {
      const selected = new Set<ts.Statement>();
      const imports = new Map<ts.ImportDeclaration, Set<string>>();
      const visit = (node: ts.Node) => {
        if (ts.isIdentifier(node)) {
          for (const declaration of checker.getSymbolAtLocation(node)
            ?.declarations ?? []) {
            if (declaration.getSourceFile() !== source) continue;
            let top: ts.Node = declaration;
            while (top.parent && top.parent !== source) top = top.parent;
            if (ts.isImportDeclaration(top)) {
              const names = imports.get(top) ?? new Set<string>();
              names.add(node.text);
              imports.set(top, names);
            } else if (ts.isStatement(top) && !selected.has(top)) {
              selected.add(top);
              ts.forEachChild(top, visit);
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      selected.add(statement);
      visit(statement);
      const snippets = source.statements.flatMap((node) => {
        if (selected.has(node)) return [node.getText(source)];
        const names = ts.isImportDeclaration(node)
          ? imports.get(node)
          : undefined;
        if (!names || !ts.isImportDeclaration(node) || !node.importClause)
          return [];
        const clause = node.importClause;
        const bindings = clause.namedBindings;
        const usedBindings =
          bindings && ts.isNamedImports(bindings)
            ? ts.factory.updateNamedImports(
                bindings,
                bindings.elements.filter((item) => names.has(item.name.text)),
              )
            : bindings;
        const next = ts.factory.updateImportDeclaration(
          node,
          node.modifiers,
          ts.factory.updateImportClause(
            clause,
            clause.isTypeOnly,
            clause.name && names.has(clause.name.text)
              ? clause.name
              : undefined,
            usedBindings &&
              ts.isNamedImports(usedBindings) &&
              !usedBindings.elements.length
              ? undefined
              : usedBindings,
          ),
          node.moduleSpecifier,
          node.attributes,
        );
        return [printer.printNode(ts.EmitHint.Unspecified, next, source)];
      });
      return [name, snippets.join("\n\n")];
    }),
  );
}

/** Build-time only: the browser receives strings, not the TypeScript compiler. */
export function exampleSourcesPlugin(): Plugin {
  return {
    name: "dg-example-sources",
    enforce: "pre",
    load(id) {
      const [filename, query] = id.split("?");
      if (!new URLSearchParams(query).has("examples")) return;
      this.addWatchFile(filename);
      return `export default ${JSON.stringify(extractExampleSources(filename))};`;
    },
  };
}
