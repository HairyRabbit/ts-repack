import ts from "typescript"
import * as path from "path"
import transform from "../transformer"

export default async function packDeno(rootNames: string[], config: ts.CompilerOptions): Promise<void> {
  const root = config.baseUrl || process.cwd()
  const rootDir = config.rootDir || './'
  const outDir = `__MODULE_DENO__`

  rootNames.forEach(rootName => {
    const content: string | undefined = ts.sys.readFile(rootName)
    if (undefined === content)
      return
    const sourceFile: ts.SourceFile = ts.createSourceFile(rootName, content, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
    const printer = ts.createPrinter()
    const transformed = ts.transform(sourceFile, [transform(replace)], {
      module: ts.ModuleKind.ESNext
    }).transformed
    const result = printer.printNode(ts.EmitHint.Unspecified, transformed[0], sourceFile)    
    const relativePath = path.relative(root, path.relative(rootDir, rootName))
    const destPath = path.resolve(outDir, relativePath)
    console.log(outDir, rootName, relativePath, destPath)

    ts.sys.writeFile(destPath, result)
  })
}

function replace(str: string): string {
  return str + ".ts"
}
