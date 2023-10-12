
import sharp from 'sharp';
import fs from 'fs-extra'
import path from 'path';


export default async function processImages(options) {

  const {
    inputDirectory, 
    targetWidth = null, 
    targetHeight = null, 
    mode,
    cropfit,
    compress,
    outputDirectory
  } = options


  try {
    // Create the output directory if it doesn't exist
    await fs.ensureDir(outputDirectory);

    // List all files in the input directory
    const files = await fs.readdir(inputDirectory);

    // Process each image
    for (const file of files) {
      // Check if the file is an image (you can add more image extensions if needed)
      if (file.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const inputPath = `${inputDirectory}/${file}`;
        const filenameWithoutExtension = path.basename(inputPath, path.extname(inputPath));

        let resizeOptions

        if(mode === "width"){
          // Resize and optionally compress the image
          resizeOptions = { width: targetWidth, withoutEnlargement: true }
        }
        
        if (mode === "height") {
          resizeOptions = { height: targetHeight, withoutEnlargement: true }
        } 

        // If mode is BOTH we check the cropfit
        if(cropfit === 'cover'){
          resizeOptions = { width: targetWidth, height: targetHeight, withoutEnlargement: true, fit: sharp.fit.cover, position: 'center' }
        }

        if(cropfit === 'contain'){
          resizeOptions = { width: targetWidth, height: targetHeight, withoutEnlargement: true, fit: sharp.fit.contain }
        }

        if (typeof compress === 'number') {
          await sharp(inputPath).resize(resizeOptions).jpeg({ quality: compress }).toFile(`${outputDirectory}/${filenameWithoutExtension}.jpg`); 
        } else {
          await sharp(inputPath).resize(resizeOptions).toFile(`${outputDirectory}/${file}`);
        }

      }
    }

    console.log(`Image processing completed!`);
  } catch (err) {
    console.error('Error:', err);
  }
}