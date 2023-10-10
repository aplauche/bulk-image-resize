import chalk from 'chalk';
import wizard from './wizard.js';
import processImages from './processImages.js'



async function main() {
  console.log(chalk.bold('Configure your settings:'));
  try {
    const {
      inputDirectory, 
      targetWidth = null, 
      targetHeight = null, 
      mode,
      cropfit,
      compress
    } = await wizard();
    const outputDirectory = 'output'; // Output directory within the working directory
    await processImages(inputDirectory, outputDirectory, targetWidth, targetHeight, mode, cropfit, compress)
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
