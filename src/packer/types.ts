import ts from 'typescript'
import transform from '../transformer'

export default function packTypes(rootNames: string[], config: ts.CompilerOptions): void {
  console.log(`[types] start`)
  const overridedConfig = overrideConfig(config)
  const program = ts.createProgram(rootNames, overridedConfig)
  console.log(`[types] emit "${overridedConfig.outDir}"`)
  program.emit(undefined, undefined, undefined, true, {
    after: [transform()]
  })
  console.log(`[types] done`)
}

function overrideConfig(config: ts.CompilerOptions): ts.CompilerOptions {
  config.target = ts.ScriptTarget.ES2015
  config.module = ts.ModuleKind.CommonJS
  config.outDir = config.outDir + '/types'
  return config
}
