
import sharp from 'sharp';
import fs from 'fs-extra'



export default async function processImages(inputDirectory, outputDirectory, width, height, mode, cropfit, compress) {
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
        const outputPath = `${outputDirectory}/${file}`;

        let image

        if(mode === "Width"){
          // Resize and optionally compress the image
          image = sharp(inputPath).resize({ width, withoutEnlargement: true });
        }
        
        if (mode === "Height") {
          image = sharp(inputPath).resize({ height, withoutEnlargement: true });
        } 

        // If mode is BOTH we check the cropfit
        if(cropfit === 'cover'){
          image = sharp(inputPath).resize({ width, height, withoutEnlargement: true, fit: sharp.fit.cover, position: 'center' });
        }

        if(cropfit === 'contain'){
          image = sharp(inputPath).resize({ width, height, withoutEnlargement: true, fit: sharp.fit.contain });
        }
          
          


        if (typeof compress === 'integer') {
          image = image.jpeg({ quality: compress }); 
        }

        await image.toFile(outputPath);
      }
    }

    console.log(`Image processing completed!`);
  } catch (err) {
    console.error('Error:', err);
  }
}