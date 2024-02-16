import meow from 'meow'

export default function handleFlags(){

  const cli = meow(`
    Usage
      $ bulk-image-resize
    
    Options
      --width, -w  Target width in pixels
      --height, -h  Target height in pixels
      --quality, -q  Quality 1 - 100 
    
    Examples
      $ bulk-image-resize -w=800 -h=600 -q=70
    
    Notes
      When including just a width or height flag the other will be set to auto. If including both you will be prompted with a choice for cover/contain strategy.
    `, {
    importMeta: import.meta,
    booleanDefault: undefined,
    inferType: true,
    flags: {
      targetWidth: {
        type: 'number',
        shortFlag: 'w'
      },
      targetHeight: {
        type: 'number',
        shortFlag: 'h'
      },
      quality: {
        type: 'number',
        shortFlag: 'q',
      },
    }
    });
    
    
    const {quality, targetWidth, targetHeight} = cli.flags
    
    if(
    typeof quality !== 'undefined' && 
    (typeof quality !== "number" || quality < 1 || quality > 100)
    ){
    console.error(`Quality flag not valid`)
    process.exit(1)
    }
    
    if(
    typeof targetWidth !== 'undefined' && 
    (typeof targetWidth !== "number" || targetWidth < 1)
    ){
    console.error(`Width flag requires a positive integer`)
    process.exit(1)
    }
    
    if(
    typeof targetHeight !== 'undefined' && 
    (typeof targetHeight !== "number" || targetHeight < 1)
    ){
    console.error(`Height flag requires a positive integer`)
    process.exit(1)
    }

    return cli.flags
}
