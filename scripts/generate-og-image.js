const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  const svgPath = path.join(__dirname, '../public/kbm_logo.svg');
  const outputPath = path.join(__dirname, '../public/og-logo.png');
  
  // Read SVG file
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Convert SVG to PNG at 1200x630 (optimal for social media)
  // The logo is 300x100 (3:1 ratio), so we'll scale it up with padding
  await sharp(svgBuffer)
    .resize(900, 300, { 
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .extend({
      top: 165,
      bottom: 165,
      left: 150,
      right: 150,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
  
  console.log('OG image generated successfully at:', outputPath);
}

generateOGImage().catch(console.error);