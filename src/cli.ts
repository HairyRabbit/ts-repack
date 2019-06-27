import repack, { BUILDIN_TARGETS, Target, Options } from './repack'
import yargs from 'yargs'

export default function main(): void {  
  (yargs as yargs.Argv<Options>)
    .strict()
    .command({
      command: `$0 <target>`,
      describe: 'repack source by target',
      handler,
      builder: (yargs: yargs.Argv<Options>): yargs.Argv<Options> => {
        return yargs.positional('target', {
          describe: 'task target',
          type: 'string',
          choices: BUILDIN_TARGETS
        })
      }
    })
    .option(`output`, {
      alias: `o`,
      describe: `The output dir`,
      type: `string`,
      defualt: `dist`
    })
    .help('h')
    .alias('h', 'help')
    .argv
}

function handler(args: yargs.Arguments<Options>): void {
  const { target, output } = args
  if(!target) {
    yargs.showHelp()
    return
  }

  const options: Options = {
    output: output
  }
  
  repack(target as Target, options)
}
