import ts from 'typescript'
import emit from '../emitter'
import overrideOutDir from '../overrideOutDir'
import { Options } from '../repack'

export const DEFAULT_MJS_OUTDIR: string = 'mjs'

export const DEFAULT_MJS_CONFIG: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2015,
  module: ts.ModuleKind.ESNext,
  sourceMap: true,
  declaration: true,
  declarationMap: true
}

export default async function packModuleJS(rootNames: string[], config: ts.CompilerOptions, options: Options): Promise<void> {
  console.log(`[mjs] start`)
  const { output } = options
  const outDir = output || overrideOutDir(config.outDir, DEFAULT_MJS_OUTDIR)
  const overrideConfig = {
    ...DEFAULT_MJS_CONFIG,
    outDir
  }
  const program = ts.createProgram(rootNames, overrideConfig)
  console.log(`[mjs] emit "${outDir}"`)
  program.emit(undefined, emit('.mjs'), undefined, undefined, {
    after: []
  })
  console.log(`[mjs] done`)
}
