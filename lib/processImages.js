import sharp from 'sharp';
import fs from 'fs-extra'
import path from 'path';
import mime from 'mime-types'
import chalk from 'chalk';
import boxen from 'boxen';


function isImage(filePath) {
  const mimeType = mime.lookup(filePath);
  return mimeType && mimeType.startsWith('image/');
}

export default async function processImages(options) {

  const {
    inputDirectory, 
    targetWidth = null, 
    targetHeight = null, 
    mode,
    cropfit,
    compress,
    outputDirectory,
    outputFormat
  } = options


  try {
    // Create the output directory if it doesn't exist
    await fs.ensureDir(outputDirectory);

    // List all files in the input directory
    const files = await fs.readdir(inputDirectory);

    // setup mode

    let fileNameOptionsSuffix = ""

    let resizeOptions

    if(targetWidth !== null){
      // Resize and optionally compress the image
      resizeOptions = { width: targetWidth, withoutEnlargement: true }
      fileNameOptionsSuffix += `-w${targetWidth}`
    }
    
    if (targetHeight !== null) {
      resizeOptions = { height: targetHeight, withoutEnlargement: true }
      fileNameOptionsSuffix += `-h${targetHeight}`
    } 

    if(mode == "both"){
      // If mode is BOTH we check the cropfit
      if(cropfit === 'cover'){
        resizeOptions = { width: targetWidth, height: targetHeight, withoutEnlargement: true, fit: sharp.fit.cover, position: 'center' }
      }

      if(cropfit === 'contain'){
        resizeOptions = { width: targetWidth, height: targetHeight, withoutEnlargement: true, fit: sharp.fit.contain }
      }
      fileNameOptionsSuffix += `-w${targetWidth}-h${targetHeight}`
    }

    if(mode === "none") {
      resizeOptions = null
    }

    if(!!compress){
      fileNameOptionsSuffix += `-q${compress}`
    }


    // output

    if(mode === "none" && outputFormat === "source"){
      console.log(chalk.black.bgYellow("no transformations to perform..."))
      return
    }

    console.log()
    console.log(chalk.yellow(`Processing images...`));
    console.log()


    let count = 0

    // Process each image
    for (const file of files) {
      // Check if the file is an image (you can add more image extensions if needed)
      
      if (isImage(file)) {
        const inputPath = `${inputDirectory}/${file}`;
        const filenameWithoutExtension = path.basename(inputPath, path.extname(inputPath));
        const sourceExtension = path.extname(inputPath)

        let finalFileName = filenameWithoutExtension + fileNameOptionsSuffix

        if(outputFormat === 'source'){
          await sharp(inputPath).resize(resizeOptions).toFile(`${outputDirectory}/${finalFileName}${sourceExtension}`);
        }
        if(outputFormat === 'png'){
          await sharp(inputPath).resize(resizeOptions).png({ quality: compress }).toFile(`${outputDirectory}/${finalFileName}.png`); 
        }
        if(outputFormat === 'jpg'){
          await sharp(inputPath).resize(resizeOptions).jpeg({ quality: compress }).toFile(`${outputDirectory}/${finalFileName}.jpg`); 
        }
        if(outputFormat === 'webp'){
          await sharp(inputPath).resize(resizeOptions).webp({ quality: compress }).toFile(`${outputDirectory}/${finalFileName}.webp`); 
        }

        count ++;

        const logFileName = outputFormat !== "source" ? `${finalFileName}.${outputFormat}` : `${finalFileName}${sourceExtension}` 
        
        console.log(chalk.green('• ') + chalk.bgGreen(' Saved ')  + ` ${outputDirectory}/${logFileName}`)
      }
    }

    console.log()
    console.log(chalk.green(`Image processing completed!`));
    console.log()

    console.log(boxen(`Total images processed: ` +  chalk.bold.green(count), {padding: 1}));

    console.log();
  } catch (err) {
    console.error('Error:', err);
  }
}