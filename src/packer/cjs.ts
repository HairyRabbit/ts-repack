import ts from 'typescript'
import overrideOutDir from '../overrideOutDir'

export const DEFAULT_CJS_OUTDIR: string = 'cjs'

export const DEFAULT_CJS_CONFIG: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS,
  sourceMap: true,
  declaration: true,
  declarationMap: true
}

export default function packCommonJS(rootNames: string[], config: ts.CompilerOptions): void {
  console.log(`[cjs] start`)
  const outDir = overrideOutDir(config.outDir, DEFAULT_CJS_OUTDIR)
  const overrideConfig = {
    ...DEFAULT_CJS_CONFIG,
    outDir
  }
  const program = ts.createProgram(rootNames, overrideConfig)
  console.log(`[cjs] emit "${outDir}"`)
  program.emit(undefined, undefined, undefined, undefined, {
    after: []
  })
  console.log(`[cjs] done`)
}
