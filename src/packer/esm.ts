import ts from "typescript"
import * as path from "path"
import * as url from "url"
import transform from "../transformer"

export default function packCommonJS(rootNames: string[], config: ts.CompilerOptions): void {
  console.log(`[esm] start`)
  const overridedConfig = overrideConfig(config)
  const program = ts.createProgram(rootNames, overridedConfig)
  console.log(`[esm] emit "${overridedConfig.outDir}"`)
  program.emit(undefined, undefined, undefined, undefined, {
    after: [transform(replace)]
  })
  console.log(`[esm] done`)
}

function overrideConfig(config: ts.CompilerOptions): ts.CompilerOptions {
  config.target = ts.ScriptTarget.ES2015
  config.module = ts.ModuleKind.ESNext
  config.outDir = config.outDir + '/esm'
  return config
}

function replace(str: string, decl: ts.ImportDeclaration): string | null {
  if (isModule(str)) return null
  const src: ts.SourceFile = decl.getSourceFile()
  if (undefined === src) return null
  const fileName: string = src.fileName
  /** @todos name mapper */
  console.log(fileName, str);
  if (undefined === require.extensions[".ts"]) require.extensions[".ts"] = require.extensions[".js"]
  const fileDirectory: string = path.dirname(fileName)
  const absoulted = require.resolve(path.resolve(fileDirectory, str))
  const relatived = formatRelativePath(path.relative(fileDirectory, absoulted))
  return replaceExtname(relatived, ".js")
}

function isModule(str: string): boolean {
  return !/[\/\\]/g.test(str)
}

function formatRelativePath(filePath: string) {
  const formatten = filePath.split(path.sep).join(path.posix.sep)
  return url.format(formatten.startsWith("../") ? formatten : "./" + formatten)
}

function replaceExtname(filePath: string, ext: string): string {
  return filePath.replace(path.extname(filePath), ext)
}
