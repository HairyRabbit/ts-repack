import * as path from 'path'
import ts from 'typescript'
import transform from '../transformer'

export default async function packModuleJS(rootNames: string[], config: ts.CompilerOptions): Promise<void> {
  console.log(`[mjs] start`)
  const overridedConfig = overrideConfig(config)
  const program = ts.createProgram(rootNames, overridedConfig)
  console.log(`[mjs] emit "${overridedConfig.outDir}"`)
  program.emit(undefined, emit, undefined, undefined, {
    after: [ transform() ]
  })
  console.log(`[mjs] done`)
}

function overrideConfig(config: ts.CompilerOptions): ts.CompilerOptions {
  config.target = ts.ScriptTarget.ESNext
  config.module = ts.ModuleKind.ESNext
  // config.outDir = '__MODULE_MJS__'
  config.outDir = config.outDir + '/mjs'
  return config
}

function emit(fileName: string, data: string) {
  const ext = path.extname(fileName)
  return ts.sys.writeFile('' === ext ? fileName : replaceExtname(fileName, '.mjs'), data)
}

function replaceExtname(filePath: string, ext: string): string {
  return filePath.replace(path.extname(filePath), ext)
}
