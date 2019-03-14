import ts from 'typescript'
import transform from '../transformer'

export default function packCommonJS(rootNames: string[], config: ts.CompilerOptions): void {
  console.log(`[cjs] start`)
  const overridedConfig = overrideConfig(config)
  const program = ts.createProgram(rootNames, overridedConfig)
  console.log(`[cjs] emit "${overridedConfig.outDir}"`)
  program.emit(undefined, undefined, undefined, undefined, {
    after: [transform()]
  })
  console.log(`[cjs] done`)
}

function overrideConfig(config: ts.CompilerOptions): ts.CompilerOptions {
  config.target = ts.ScriptTarget.ES2015
  config.module = ts.ModuleKind.CommonJS
  config.outDir = config.outDir + '/cjs'
  return config
}
