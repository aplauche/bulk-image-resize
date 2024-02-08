import chalk from 'chalk';
import wizard from './wizard.js';
import processImages from './processImages.js'

import boxen from 'boxen';


async function main() {

  console.log(boxen('Bulk Image Resizer', {padding: 1}));
  console.log()
  console.log(chalk.underline.bold('Configure your settings:'));
  console.log()
  try {
    const options = await wizard();
    await processImages(options)
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
