import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourceDir = join(__dirname, '../public/images');
const outputDir = join(__dirname, '../public/images-opt');

const THUMB_SIZE = 400;
const FULL_SIZE = 1920;
const QUALITY = 80;

async function processImage(sourcePath, lodgeDir, filename) {
  const lodgeOutputDir = join(outputDir, lodgeDir);
  const thumbDir = join(lodgeOutputDir, 'thumb');

  // Create directories
  mkdirSync(lodgeOutputDir, { recursive: true });
  mkdirSync(thumbDir, { recursive: true });

  // Normalize filename (lowercase, no spaces)
  const outName = basename(filename).toLowerCase().replace(/\s+/g, '-');
  const jpgName = outName.replace(/\.(jpeg|jpg|png|gif|webp)$/i, '.jpg');

  const fullPath = join(lodgeOutputDir, jpgName);
  const thumbPath = join(thumbDir, jpgName);

  // Skip if already processed
  if (existsSync(fullPath) && existsSync(thumbPath)) {
    return { skipped: true };
  }

  try {
    const image = sharp(sourcePath);
    const metadata = await image.metadata();

    // Generate full-size optimized version
    await sharp(sourcePath)
      .resize(FULL_SIZE, FULL_SIZE, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .toFile(fullPath);

    // Generate thumbnail
    await sharp(sourcePath)
      .resize(THUMB_SIZE, THUMB_SIZE, {
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({ quality: QUALITY })
      .toFile(thumbPath);

    return {
      skipped: false,
      original: metadata.size,
      full: statSync(fullPath).size,
      thumb: statSync(thumbPath).size
    };
  } catch (err) {
    console.error(`  Error processing ${sourcePath}: ${err.message}`);
    return { error: true };
  }
}

async function main() {
  console.log('Optimizing images...\n');

  const lodges = readdirSync(sourceDir)
    .filter(f => statSync(join(sourceDir, f)).isDirectory());

  let totalOriginal = 0;
  let totalOptimized = 0;
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const lodge of lodges) {
    const lodgePath = join(sourceDir, lodge);
    const images = readdirSync(lodgePath)
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

    process.stdout.write(`${lodge}: `);

    for (const img of images) {
      const result = await processImage(join(lodgePath, img), lodge, img);

      if (result.skipped) {
        skipped++;
        process.stdout.write('.');
      } else if (result.error) {
        errors++;
        process.stdout.write('x');
      } else {
        processed++;
        totalOriginal += result.original || 0;
        totalOptimized += result.full + result.thumb;
        process.stdout.write('✓');
      }
    }
    console.log();
  }

  console.log(`\nDone!`);
  console.log(`  Processed: ${processed}`);
  console.log(`  Skipped (already done): ${skipped}`);
  console.log(`  Errors: ${errors}`);

  if (totalOriginal > 0) {
    const savings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
    console.log(`  Size reduction: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalOptimized / 1024 / 1024).toFixed(1)}MB (${savings}% smaller)`);
  }
}

main();
