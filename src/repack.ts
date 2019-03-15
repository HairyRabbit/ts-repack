import ts from 'typescript'
import * as packs from './packer'
import readConfig from './readConfig'

/** build targets  */
export const enum Target {
  /** commonjs */ CJS = 'cjs',
  /** modules */ MJS = 'mjs',
  /** modules but used for browser */ ESM = 'esm',
  /** used for deno */ DENO = 'deno'
}

/** supports targets */
export const BUILDIN_TARGETS: Target[] = [
  Target.CJS,
  Target.MJS,
  Target.ESM,
  Target.DENO
]

interface Options {

}

const DEFAULT_OPTIONS: Options = {}

export default function repack(targets: Target[], options: Partial<Options> = {}): void {
  const {} = { ...DEFAULT_OPTIONS, ...options }
  const config: ts.ParsedCommandLine = readConfig()

  targets.forEach(target => {
    packs[target](
      [ ...config.fileNames ], 
      { ...config.options }
    )
  })
}
