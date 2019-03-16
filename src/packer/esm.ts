import ts from "typescript"
import * as path from "path"
import * as url from "url"
import emit, { replaceExtname } from '../emitter'
import overrideOutDir from '../overrideOutDir'
import transform, { NOTRANSFORM } from "../transformer"
import isModule from '../isModule'
import { Ok, Err, Result } from 'util-extra/container/result'

export const DEFAULT_ESM_OUTDIR: string = 'esm'

export const DEFAULT_ESM_CONFIG: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  sourceMap: true
}

export default function packCommonJS(rootNames: string[], config: ts.CompilerOptions): void {
  console.log(`[esm] start`)
  const outDir = overrideOutDir(config.outDir, DEFAULT_ESM_OUTDIR)
  const overrideConfig = {
    ...DEFAULT_ESM_CONFIG,
    outDir
  }
  const program = ts.createProgram(rootNames, overrideConfig)
  console.log(`[esm] emit "${outDir}"`)
  program.emit(undefined, emit('.mjs'), undefined, undefined, {
    after: [transform(replace)]
  })
  console.log(`[esm] done`)
}

function replace(str: string, decl: ts.ImportDeclaration): Result<string, Error> {
  if (isModule(str)) {
    /** @todos name mapper */
    return Err(new Error(
      `Module "${str}" may not works on browser, you should instead of polyfill or mock library`
    ))
  }

  const src: ts.SourceFile = decl.getSourceFile()
  if (undefined === src) return Ok(NOTRANSFORM)
  const fileName: string = src.fileName
  console.log(fileName, str)

  registerTSResolver()
  
  const fileDirectory: string = path.dirname(fileName)
  const absoulted: string = require.resolve(path.resolve(fileDirectory, str))
  const relatived: string = formatRelativePath(path.relative(fileDirectory, absoulted))
  
  return Ok(replaceExtname(relatived, ".mjs"))
}

function formatRelativePath(filePath: string): string {
  const formatten = filePath.split(path.sep).join(path.posix.sep)
  return url.format(formatten.startsWith("../") ? formatten : "./" + formatten)
}

function registerTSResolver(): void {
  if (undefined !== require.extensions[".ts"]) return 
  require.extensions[".ts"] = require.extensions[".js"]
}
