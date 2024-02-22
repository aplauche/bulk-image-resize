import chalk from 'chalk';
import meow from 'meow'

const flagError = (msg) => {
  console.log()
  console.error(`${chalk.bgRed(' Error ')} ${msg}`)
  console.log()
  process.exit(1)
}

export default function handleFlags(){

  const cli = meow(`
    ${chalk.bold(`Usage`)}
      $ bulk-image-resize
    
    ${chalk.bold(`Options`)}
      --width, -w  ${chalk.dim(`Target width in pixels`)}
      --height, -h  ${chalk.dim(`Target height in pixels`)}
      --quality, -q  ${chalk.dim(`Quality 1 - 100`)} 
    
    ${chalk.bold(`Examples`)}
      $ bulk-image-resize -w=800 -h=600 -q=70
    
    ${chalk.bold(`Notes`)}
      When including just a width or height flag the other will be set to auto. If including both you will be prompted with a choice for cover/contain strategy.
    `, {
    importMeta: import.meta,
    booleanDefault: undefined,
    inferType: true,
    flags: {
      targetWidth: {
        type: 'number',
        shortFlag: 'w'
      },
      targetHeight: {
        type: 'number',
        shortFlag: 'h'
      },
      quality: {
        type: 'number',
        shortFlag: 'q',
      },
    }
    });
    
    
    const {quality, targetWidth, targetHeight} = cli.flags
    
    if(
    typeof quality !== "undefined" && 
    (quality < 1 || quality > 100 || isNaN(quality))
    ){
      flagError(`Quality flag not valid. Choose a number between 1 - 100.`)
    }
    
    if(
    typeof targetWidth !== 'undefined' && 
    (isNaN(targetWidth) || targetWidth < 1)
    ){
      flagError(`Width flag requires a positive integer.`)
    }
    
    if(
    typeof targetHeight !== 'undefined' && 
    (isNaN(targetHeight) || targetHeight < 1)
    ){
      flagError(`Height flag requires a positive integer.`)
    }

    return cli.flags
}
