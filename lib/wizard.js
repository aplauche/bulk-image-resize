import inquirer from "inquirer";
import fs from 'fs-extra'


export default async function wizard(){
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
      type: 'list',
      name: 'mode',
      message: 'Which dimensions do you want to specify?',
      choices: ['Width', 'Height', 'Both'],
      default: 'Width', // Default compression level
    },
    {
      type: 'number',
      name: 'targetWidth',
      message: 'Enter the target width in pixels (leave blank for auto):',
      default: 800,
      when: (answers) => {
        return answers.mode !== 'Height'
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
      message: 'Enter the target height in pixels (leave blank for auto):',
      default: 800,
      when: (answers) => {
        return answers.mode !== 'Width'
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
      choices: ["cover", "contain"],
      default: "cover",
      when: (answers) => {
        return answers.mode === 'Both'
      },
    },
    {
      type: 'list',
      name: 'compress',
      message: 'Select the compression level (%):',
      choices: ['None', 95,90,85,80,75,70,60,50,40,25],
      default: 'None', // Default compression level
    },
  ];

  const answers = await inquirer.prompt(questions);

  return answers

}