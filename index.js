#!/usr/bin/env node

import chalk from 'chalk';

import wizard from './lib/wizard.js';
import processImages from './lib/processImages.js'


import boxen from 'boxen';
import handleFlags from './lib/flags.js';


async function main() {

  const flags = handleFlags()

  console.log(boxen('Bulk Image Resizer', {padding: 1}));
  console.log()
  console.log(chalk.underline.bold('Configure your settings:'));
  console.log()


  try {
    const options = await wizard(flags);
    await processImages(options)
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
