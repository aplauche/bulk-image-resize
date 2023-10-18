import chalk from 'chalk';
import wizard from './wizard.js';
import processImages from './processImages.js'



async function main() {
  console.log(chalk.underline.bold('Configure your settings:'));
  try {
    const options = await wizard();
    await processImages(options)
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
