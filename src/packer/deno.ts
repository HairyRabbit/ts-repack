import ts from "typescript"
import * as path from "path"
import overrideOutDir from '../overrideOutDir'
import transform from "../transformer"
import { Result, Ok, Err } from "util-extra/container/result"
import isModule from "../isModule"
import { Options } from "../repack"

export const DEFAULT_DENO_OUTDIR: string = 'deno'

export default function packDeno(rootNames: string[], config: ts.CompilerOptions, options: Options): void {
  console.log(`[deno] start`)
  const root = config.baseUrl || process.cwd()
  const rootDir = config.rootDir || './'
  const { output } = options
  const outDir = output || overrideOutDir(config.outDir, DEFAULT_DENO_OUTDIR)
  const printer = ts.createPrinter()
  console.log(`[deno] emit "${outDir}"`)
  const results: [string, string][] = rootNames.map<[string, string]>(rootName => {
    const content: string | undefined = ts.sys.readFile(rootName)
    if (undefined === content) throw new Error(`Can't find file ${rootName}`)
    const sourceFile: ts.SourceFile = ts.createSourceFile(
      rootName, 
      content, 
      ts.ScriptTarget.Latest, 
      false, 
      ts.ScriptKind.TS
    )
    const transformed = ts.transform(sourceFile, [
      transform(replace)
    ], { module: ts.ModuleKind.ESNext }).transformed    
    const relativePath = path.relative(root, path.relative(rootDir, rootName))
    const destPath = path.resolve(outDir, relativePath)
    const result = printer.printNode(ts.EmitHint.Unspecified, transformed[0], sourceFile)
    return [destPath, result]
  })
  results.forEach(arg => ts.sys.writeFile.apply(ts.sys.writeFile, arg))
  console.log(`[deno] done`)
}

function replace(str: string): Result<string, Error> {
  if(isModule(str)) {
    /** @todo module mapper */
    return Err(new Error(
      `The module "${str}" may not work on deno, you should instead of deno std or other library`
    ))
  }
  return Ok(str + ".ts")
}
