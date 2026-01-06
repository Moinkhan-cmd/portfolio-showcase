import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logoPath = join(__dirname, '../src/images/Logo.png');
const outputPath = join(__dirname, '../public/favicon.png');
const outputIcoPath = join(__dirname, '../public/favicon.ico');

async function createCircularFavicon() {
  try {
    // Read the logo
    const image = sharp(logoPath);
    const metadata = await image.metadata();
    const size = Math.min(metadata.width, metadata.height);

    // First resize to square
    let processedImage = image.resize(size, size, {
      fit: 'cover',
      position: 'center'
    });

    // Create circular mask for 512x512
    const svgCircle512 = `
      <svg width="512" height="512">
        <circle cx="256" cy="256" r="256" fill="white"/>
      </svg>
    `;

    // Create circular mask for 32x32
    const svgCircle32 = `
      <svg width="32" height="32">
        <circle cx="16" cy="16" r="16" fill="white"/>
      </svg>
    `;

    // Resize to 512x512, apply circular mask, and save as PNG
    await processedImage
      .clone()
      .resize(512, 512)
      .composite([
        {
          input: Buffer.from(svgCircle512),
          blend: 'dest-in'
        }
      ])
      .png()
      .toFile(outputPath);

    // Resize to 32x32, apply circular mask, and save as ICO
    await processedImage
      .clone()
      .resize(32, 32)
      .composite([
        {
          input: Buffer.from(svgCircle32),
          blend: 'dest-in'
        }
      ])
      .png()
      .toFile(outputIcoPath);

    console.log('✅ Circular favicon created successfully!');
  } catch (error) {
    console.error('Error creating circular favicon:', error);
    process.exit(1);
  }
}

createCircularFavicon();

