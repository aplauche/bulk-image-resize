# Bulk Image Resize

A quick tool set for rapidly resizing and compressing images to prepare them for usage on the web.

## Installation

Install globally using:

```npm install -g bulk-image-resize```

Or run directly using if you prefer:

```npx bulk-image-resize```

## Features

 - Crop to a specified width or height while maintaining aspect ratio
 - Crop to a set aspect ratio and use cover or contain strategy to fit
 - Compress to desired level
 - Convert to jpeg/webp

## Usage

This package is a slim tool that can be quickly used to prep image files for the web that may have been handed off with incorrect dimensions or scale.

Often developers/content editors get handed huge images in uncompressed formats and it is cumbersome to manually resize and compress each one using image editing software or online tools.

This package acts as a wrapper of the sharp image tools package for quick, common use cases like setting all images in a folder to be a specific width (while maintaining their natural aspect ratio) and compressing for the web.

Prepare the images you want to process in a directory of your choosing and run `npx bulk-image-resize`. The wizard will walk you through the choices of available processing options.

## Change Log

**v0.3.0** 
- Total rework of visual feedback
- Add help message and support for flags
- Allow specification of output directory with validation
- Use smart naming that appends and transformations to filename for easy reference

---
**v0.2.0** 
- Add a mode for no resizing, compression only 
- Add more verbose logging
- Add more robust mime-type based file validation
- minor UI enhancements
- Change output dir name to "resized-images"

---
**v0.1.1** 
- Change prompts to be more concise 


---

**v0.1.0**
- Initial build