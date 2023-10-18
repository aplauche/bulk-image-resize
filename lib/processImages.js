import sharp from 'sharp';
import fs from 'fs-extra'
import path from 'path';
import mime from 'mime-types'
import chalk from 'chalk';


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

    let resizeOptions

    if(mode === "width"){
      // Resize and optionally compress the image
      resizeOptions = { width: targetWidth, withoutEnlargement: true }
    }
    
    if (mode === "height") {
      resizeOptions = { height: targetHeight, withoutEnlargement: true }
    } 

    if(mode == "both"){
      // If mode is BOTH we check the cropfit
      if(cropfit === 'cover'){
        resizeOptions = { width: targetWidth, height: targetHeight, withoutEnlargement: true, fit: sharp.fit.cover, position: 'center' }
      }

      if(cropfit === 'contain'){
        resizeOptions = { width: targetWidth, height: targetHeight, withoutEnlargement: true, fit: sharp.fit.contain }
      }
    }

    if(mode === "none") {
      resizeOptions = null
    }

    // output

    if(mode === "none" && outputFormat === "source"){
      console.log(chalk.black.bgYellow("no transformations to perform..."))
      return
    }

    console.log(chalk.yellow(`Processing...`));

    let count = 0

    // Process each image
    for (const file of files) {
      // Check if the file is an image (you can add more image extensions if needed)
      
      if (isImage(file)) {
        const inputPath = `${inputDirectory}/${file}`;
        const filenameWithoutExtension = path.basename(inputPath, path.extname(inputPath));

        if(outputFormat === 'source'){
          await sharp(inputPath).resize(resizeOptions).toFile(`${outputDirectory}/${file}`);
        }
        if(outputFormat === 'png'){
          await sharp(inputPath).resize(resizeOptions).png({ quality: compress }).toFile(`${outputDirectory}/${filenameWithoutExtension}.png`); 
        }
        if(outputFormat === 'jpg'){
          await sharp(inputPath).resize(resizeOptions).jpeg({ quality: compress }).toFile(`${outputDirectory}/${filenameWithoutExtension}.jpg`); 
        }
        if(outputFormat === 'webp'){
          await sharp(inputPath).resize(resizeOptions).webp({ quality: compress }).toFile(`${outputDirectory}/${filenameWithoutExtension}.webp`); 
        }

        count ++;
        
        console.log(chalk.green('• ') + `Saved ${outputDirectory}/${outputFormat !== "source" ? `${filenameWithoutExtension}.${outputFormat}` : file }`)
      }
    }

    console.log(chalk.green(`Image processing completed!`));
    console.log(chalk.underline(`Total processed:`) + " " + chalk.bold.green(count));
  } catch (err) {
    console.error('Error:', err);
  }
}