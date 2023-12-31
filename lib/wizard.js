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
      choices: [
        {name: "Width", value: "width" },
        {name: "Height", value: "height" },
        {name: "Both", value: "both" },
        {name: "Keep original size", value: "none" }
      ],
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
        return answers.mode == 'height' || answers.mode == 'both'
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
        return answers.mode === 'both'
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
        {name: "Same as source (no compression)", value: "source"},
      ]
    },
    {
      type: 'list',
      name: 'compress',
      message: 'Select the quality level (%):',
      choices: [100, 95,90,85,80,75,70,60,50,40,25],
      when: (answers) => {
        return answers.outputFormat !== 'source'
      },
    },
  ];

  const answers = await inquirer.prompt(questions);

  answers['outputDirectory'] = 'resized-images';

  return answers

}