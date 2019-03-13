import * as packs from './packer'
import readConfig from './readConfig'
import yargs from 'yargs'
import nodeModules from './module.json'


export const enum Target {
  /** commonjs */ CJS = 'cjs',
  MJS = 'mjs',
  ESM = 'esm',
  /** used for deno */ DENO = 'deno',
  /** types file */ TYPES = 'types'
}

async function main(): Promise<void> {  
  yargs
    .strict()
    .command({
      command: `$0 [targets...]`,
      describe: 'repack source by target',
      handler,
      builder: (yargs: yargs.Argv): yargs.Argv => {
        return yargs.positional('targets', {
          describe: 'targets',
          type: 'string',
          choices: [
            Target.CJS,
            Target.MJS,
            Target.ESM,
            Target.DENO,
            Target.TYPES
          ]
        })
      }
    })
    .version()
    .alias('v', 'version')    
    .help('h')
    .alias('h', 'help')
    // .showHelpOnFail(true)
    .argv
  // console.log(config)
  // packs.cjs(fileNames, options)
  // packs.mjs(fileNames, options)
  // packs.esm(fileNames, options)
  // packs.deno(config.fileNames, config.options)
  // packs.types(config.fileNames, config.options)
}

async function handler(argv: yargs.Arguments): Promise<void> {  
  if(!(Array.isArray(argv.targets) && argv.targets.length > 0)) {
    yargs.showHelp()
    return
  }
  const config = readConfig()
  const targets: Target[] = argv.targets as Target[]
  await Promise.all(targets.map(target => {
    packs[target](config.fileNames, config.options)
  }))
  return
}

main()
