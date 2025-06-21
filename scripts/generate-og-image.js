const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  const svgPath = path.join(__dirname, '../app/icon.svg');
  const outputPath = path.join(__dirname, '../public/og-logo.png');
  
  // Read SVG file
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Convert SVG to PNG at 1200x1200 for optimal social media display
  await sharp(svgBuffer)
    .resize(1200, 1200, { 
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toFile(outputPath);
  
  console.log('OG image generated successfully at:', outputPath);
}

generateOGImage().catch(console.error);