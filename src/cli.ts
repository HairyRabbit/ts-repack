import repack, { BUILDIN_TARGETS, Target } from './repack'
import yargs from 'yargs'

export default function main(): void {  
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
          choices: (BUILDIN_TARGETS as string[]).concat('all')
        })
      }
    })
    .version()
    .alias('v', 'version')    
    .help('h')
    .alias('h', 'help')
    .argv
}

function handler(argv: yargs.Arguments): void {  
  if(!(Array.isArray(argv.targets) && argv.targets.length > 0)) {
    yargs.showHelp()
    return
  }

  const targets: string[] = argv.targets
  const tasks: Target[] = targets.includes('all') 
    ? BUILDIN_TARGETS 
    : targets as Target[]
  
  repack(tasks)
}
