import ts from 'typescript'
import transform from '../transformer'

export default async function packTypes(rootNames: string[], config: ts.CompilerOptions): Promise<void> {
  const overridedConfig = overrideConfig(config)
  const program = ts.createProgram(rootNames, overridedConfig)
  program.emit(undefined, undefined, undefined, true, {
    after: [ transform() ]
  })
}

function overrideConfig(config: ts.CompilerOptions): ts.CompilerOptions {
  config.target = ts.ScriptTarget.ES2015
  config.module = ts.ModuleKind.CommonJS
  config.outDir = '__MODULE_TYPES__'
  return config
}
