# @ap/image-toolkit

A quick toolset for rapidly resizing and compressing images to prepare them for usage on the web.

## Installation

Install globally using

`npm install -g @ap/image-toolkit`

Or run using npx instead if you prefer.

`npx @ap/image-toolkit`

## Features

 - Crop to a specified width or height while maintaining aspect ratio
 - Crop to a set asect ratio and use cover or contain strategy to fit
 - Compress to desired level
 - Convert to jpeg/webp

## Usage

The idea with this package is a slim tool that can be quickly used to prep files for deployment to a CMS that may have been handed off with incorrect dimensions or scale.

Often developers/content editors get handed huge images in uncompressed formats and it is cumbersome to manually resize and compress each one using image editing software or online tools.

This package acts as a wrapper of the sharp image tools package to allow for quick common use cases like setting all images in a folder to be a specific width (while maintaining their natural aspect ratio) and compressing for the web.

Prepare the images you want to process in a directory of your choosing and run `npx @ap/image-toolkit`. The wizard will walk you through the choices of processing options.