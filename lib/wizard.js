import inquirer from "inquirer";
import fs from 'fs-extra'
import chalk from 'chalk';


function removeTrailingSlash(str) {
  if (str.charAt(str.length - 1) === '/') {
    // Check if the last character is "/"
    return str.slice(0, -1); // Remove the last character
  } else {
    return str; // No trailing slash, return the original string
  }
}

export default async function wizard(flags){

  let showDimensions = true

  if(!!flags.targetWidth || !!flags.targetHeight) {
    showDimensions = false
  }

  const questions = [
    {
      type: 'input',
      name: 'inputDirectory',
      message: 'Enter the path to the input directory:',
      default: '.',
      validate: (input) => {
        if (fs.existsSync(input)) {
          return true;
        }
        return 'Directory does not exist.';
      },
    },
    {
      type: 'input',
      name: 'outputDirectory',
      message: 'Enter the path to save the new files:',
      default: './resized',
      validate: (input) => {
        if (fs.existsSync(input)) {
          return `Directory already exists at ${input}`;
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'mode',
      message: 'Which dimensions do you want to specify?',
      choices: [
        {name: "Width", value: "width" },
        {name: "Height", value: "height" },
        {name: "Both", value: "both" },
        {name: "Keep original size", value: "none" }
      ],
      when: () => {
        return showDimensions
      },
    },
    {
      type: 'number',
      name: 'targetWidth',
      message: 'Enter the target width in pixels:',
      default: 800,
      when: (answers) => {
        return answers.mode == 'width' || answers.mode == 'both'
      },
      validate: (input) => {
        if (Number.isInteger(input) && input > 0) {
          return true;
        }
        return 'Please enter a valid positive integer.';
      },
    },
    {
      type: 'number',
      name: 'targetHeight',
      message: 'Enter the target height in pixels:',
      default: 800,
      when: (answers) => {
        return (answers.mode == 'height' || answers.mode == 'both')
      },
      validate: (input) => {
        if (Number.isInteger(input) && input > 0) {
          return true;
        }
        return 'Please enter a valid positive integer.';
      },
    },
    {
      type: 'list',
      name: 'cropfit',
      message: 'Select a crop strategy:',
      choices: [
        {name: "Cover", value: "cover" },
        {name: "Contain", value: "contain" }
      ],
      default: "cover",
      when: (answers) => {
        return (
          answers.mode === 'both' ||
          (!!flags.targetWidth && !!flags.targetHeight)
        )
      },
    },
    {
      type: 'list',
      name: 'outputFormat',
      message: 'Select the desired output format:',
      choices: [
        {name: "jpg", value: "jpg"},
        {name: "png", value: "png"},
        {name: "webp", value: "webp"},
        {name: "Same as source w/o compression", 
          value: "source", 
          disabled: () => {
            return !!flags.quality ? 'Not available when using -q flag' : false
          } 
        },
      ],
    },
    {
      type: 'list',
      name: 'quality',
      message: 'Select the desired quality level:',
      choices: [
        {name: `Full ${chalk.dim("-- (100%)")}`, value: 100},
        {name: `Best ${chalk.dim("-- (90%)")}`, value: 90},
        {name: `Better ${chalk.dim("-- (80%)")}`, value: 80},
        {name: `Good ${chalk.dim("-- (70%)")}`, value: 70},
        {name: `Acceptable ${chalk.dim("-- (60%)")}`, value: 60},
        {name: `Low ${chalk.dim("-- (50%)")}`, value: 50},
        {name: `Ultra Low ${chalk.dim("-- (25%)")}`, value: 25},
      ],
      when: (answers) => {
        return answers.outputFormat !== 'source'
      },
    },
  ];

  let answers = await inquirer.prompt(questions);

  answers.outputDirectory = removeTrailingSlash(answers.outputDirectory)

  answers = {...flags, ...answers}

  return answers

}