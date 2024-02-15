import chalk from 'chalk';
import meow from 'meow'
import wizard from './wizard.js';
import processImages from './processImages.js'


import boxen from 'boxen';


async function main() {

  const cli = meow(`
    Usage
      $ bulk-image-resize

    Options
      --width, -w  Target width in pixels
      --height, -h  Target height in pixels
      --quality, -q  Quality 1 - 100 

    Examples
      $ bulk-image-resize -w=800 -h=600 -q=70

    Notes
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
      compress: {
        type: 'number',
        shortFlag: 'q',
      },
    }
  });


  const {compress, targetWidth, targetHeight} = cli.flags

  if(
    typeof compress !== 'undefined' && 
    (typeof compress !== "number" || compress < 1 || compress > 100)
  ){
    console.error(`Quality flag not valid`)
    process.exit(1)
  }

  if(
    typeof targetWidth !== 'undefined' && 
    (typeof targetWidth !== "number" || targetWidth < 1)
  ){
    console.error(`Width flag requires a positive integer`)
    process.exit(1)
  }

  if(
    typeof targetHeight !== 'undefined' && 
    (typeof targetHeight !== "number" || targetHeight < 1)
  ){
    console.error(`Height flag requires a positive integer`)
    process.exit(1)
  }

  console.log(boxen('Bulk Image Resizer', {padding: 1}));
  console.log()
  console.log(chalk.underline.bold('Configure your settings:'));
  console.log()


  try {
    const options = await wizard(cli.flags);
    await processImages(options)
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
