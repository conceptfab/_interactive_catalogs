#!/usr/bin/env node

/**
 * generate-thumbnails.mjs
 *
 * Scans /public/catalogs/ for images and generates
 * responsive thumbnail variants appropriate for each view/layout.
 *
 * Generated files are placed next to the originals with a `-{width}w` suffix:
 *   hero_00.webp  ->  hero_00-640w.webp, hero_00-1280w.webp, hero_00-1920w.webp
 *
 * Usage:
 *   node scripts/generate-thumbnails.mjs          # generate missing thumbnails
 *   node scripts/generate-thumbnails.mjs --force   # regenerate all
 *   node scripts/generate-thumbnails.mjs --clean   # remove all generated thumbnails
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const MANIFEST_OUTPUT = path.join(
  ROOT,
  'src',
  'generated',
  'responsive-image-manifest.json',
);

// ---------------------------------------------------------------------------
// Size presets per section
// ---------------------------------------------------------------------------

/** @type {Record<string, number[]>} */
const SECTION_WIDTHS = {
  hero: [640, 1280, 1920],
  gallery: [400, 800, 1200],
  packshots: [300, 600],
  overview: [400, 800],
  variants: [400, 800],
  // Materials full-size images (configurator preview)
  materials_full: [400, 800],
  // Materials thumbnails (swatches) – tiny
  materials_thumb: [96, 192],
};

const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png']);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check if sharp is available */
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error(
    'Error: sharp is not installed. Run: npm install --save-dev sharp',
  );
  process.exit(1);
}

function isImageFile(fileName) {
  return IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase());
}

function isGeneratedThumbnail(fileName) {
  return /-\d+w\.\w+$/.test(fileName);
}

function thumbnailName(originalName, width) {
  const parsed = path.parse(originalName);
  return `${parsed.name}-${width}w${parsed.ext}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPublicUrl(filePath) {
  return `/${path.relative(PUBLIC, filePath).replace(/\\/g, '/')}`;
}

async function dirExists(dirPath) {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getImageWidth(filePath) {
  const metadata = await sharp(filePath).metadata();
  return metadata.width ?? 0;
}

// ---------------------------------------------------------------------------
// Generation logic
// ---------------------------------------------------------------------------

/**
 * Generate thumbnails for a single image at the given widths.
 * Skips widths >= the original image width.
 * @returns {number} Number of thumbnails generated
 */
async function generateForImage(imagePath, widths, force = false) {
  let generated = 0;
  const dir = path.dirname(imagePath);
  const fileName = path.basename(imagePath);
  const ext = path.extname(fileName).toLowerCase();

  let originalWidth;
  try {
    originalWidth = await getImageWidth(imagePath);
  } catch (err) {
    console.warn(`  Skipping ${imagePath}: ${err.message}`);
    return 0;
  }

  for (const w of widths) {
    if (w >= originalWidth) continue;

    const outName = thumbnailName(fileName, w);
    const outPath = path.join(dir, outName);

    if (!force && (await fileExists(outPath))) continue;

    try {
      let pipeline = sharp(imagePath).resize(w, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });

      // Output format matches original
      if (ext === '.webp') {
        pipeline = pipeline.webp({ quality: 82, effort: 4 });
      } else if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ compressionLevel: 8 });
      }

      await pipeline.toFile(outPath);
      generated++;
    } catch (err) {
      console.warn(`  Failed to generate ${outName}: ${err.message}`);
    }
  }

  return generated;
}

/**
 * Process a directory, generating thumbnails for all images found.
 */
async function processDirectory(dirPath, widths, force = false) {
  if (!(await dirExists(dirPath))) return 0;

  const files = await fs.readdir(dirPath);
  let total = 0;

  for (const file of files) {
    if (!isImageFile(file)) continue;
    if (isGeneratedThumbnail(file)) continue;

    const filePath = path.join(dirPath, file);
    total += await generateForImage(filePath, widths, force);
  }

  return total;
}

/**
 * Process materials directory with split logic:
 * - *_thumb.webp files get tiny sizes (swatches)
 * - other images get medium sizes (configurator preview)
 */
async function processMaterialsDirectory(dirPath, force = false) {
  if (!(await dirExists(dirPath))) return 0;

  const files = await fs.readdir(dirPath);
  let total = 0;

  for (const file of files) {
    if (!isImageFile(file)) continue;
    if (isGeneratedThumbnail(file)) continue;

    const filePath = path.join(dirPath, file);
    const isThumb = file.includes('_thumb');
    const widths = isThumb
      ? SECTION_WIDTHS.materials_thumb
      : SECTION_WIDTHS.materials_full;

    total += await generateForImage(filePath, widths, force);
  }

  return total;
}

// ---------------------------------------------------------------------------
// Clean generated thumbnails
// ---------------------------------------------------------------------------

async function cleanDirectory(dirPath) {
  if (!(await dirExists(dirPath))) return 0;

  const files = await fs.readdir(dirPath);
  let removed = 0;

  for (const file of files) {
    if (isGeneratedThumbnail(file)) {
      await fs.unlink(path.join(dirPath, file));
      removed++;
    }
  }

  return removed;
}

async function cleanAll() {
  console.log('Cleaning generated thumbnails...');
  let total = 0;

  const catalogsDir = path.join(PUBLIC, 'catalogs');
  if (await dirExists(catalogsDir)) {
    const catalogs = await fs.readdir(catalogsDir);
    for (const catalog of catalogs) {
      const catalogPath = path.join(catalogsDir, catalog);
      const stat = await fs.stat(catalogPath);
      if (!stat.isDirectory()) continue;

      const sections = await fs.readdir(catalogPath);
      for (const section of sections) {
        const sectionPath = path.join(catalogPath, section);
        const sectionStat = await fs.stat(sectionPath);
        if (!sectionStat.isDirectory()) continue;
        total += await cleanDirectory(sectionPath);
      }
    }
  }

  console.log(`Removed ${total} generated thumbnails.`);
  return total;
}

// ---------------------------------------------------------------------------
// Manifest of actually generated responsive variants
// ---------------------------------------------------------------------------

async function collectResponsiveManifestEntries(dirPath, manifest) {
  if (!(await dirExists(dirPath))) return;

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const siblingFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await collectResponsiveManifestEntries(fullPath, manifest);
      continue;
    }

    if (!isImageFile(entry.name)) continue;
    if (isGeneratedThumbnail(entry.name)) continue;

    const parsed = path.parse(entry.name);
    const thumbnailPattern = new RegExp(
      `^${escapeRegExp(parsed.name)}-(\\d+)w${escapeRegExp(parsed.ext)}$`,
      'i',
    );
    const widths = siblingFiles
      .map((fileName) => {
        const match = fileName.match(thumbnailPattern);
        return match ? Number(match[1]) : null;
      })
      .filter((width) => Number.isFinite(width))
      .sort((left, right) => left - right);

    manifest[toPublicUrl(fullPath)] = widths;
  }
}

async function writeResponsiveManifest() {
  const manifest = {};

  await collectResponsiveManifestEntries(path.join(PUBLIC, 'catalogs'), manifest);

  await fs.mkdir(path.dirname(MANIFEST_OUTPUT), { recursive: true });
  await fs.writeFile(MANIFEST_OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);

  return Object.keys(manifest).length;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');

  if (args.includes('--clean')) {
    await cleanAll();
    return;
  }

  if (force) {
    console.log('Force mode: regenerating all thumbnails...');
  }

  console.log('Generating responsive thumbnails...');
  const startTime = Date.now();
  let totalGenerated = 0;

  // Process each catalog
  const catalogsDir = path.join(PUBLIC, 'catalogs');
  if (!(await dirExists(catalogsDir))) {
    console.log('No catalogs directory found. Nothing to do.');
    return;
  }

  const catalogs = await fs.readdir(catalogsDir);

  for (const catalog of catalogs) {
    const catalogPath = path.join(catalogsDir, catalog);
    const stat = await fs.stat(catalogPath);
    if (!stat.isDirectory()) continue;

    console.log(`\n  ${catalog}/`);

    // Hero
    const heroDir = path.join(catalogPath, 'hero');
    const heroCount = await processDirectory(heroDir, SECTION_WIDTHS.hero, force);
    if (heroCount) console.log(`    hero: ${heroCount} thumbnails`);

    // Gallery
    const galleryDir = path.join(catalogPath, 'gallery');
    const galleryCount = await processDirectory(galleryDir, SECTION_WIDTHS.gallery, force);
    if (galleryCount) console.log(`    gallery: ${galleryCount} thumbnails`);

    // Overview
    const overviewDir = path.join(catalogPath, 'overview');
    const overviewCount = await processDirectory(overviewDir, SECTION_WIDTHS.overview, force);
    if (overviewCount) console.log(`    overview: ${overviewCount} thumbnails`);

    // Variants
    const variantsDir = path.join(catalogPath, 'variants');
    const variantsCount = await processDirectory(variantsDir, SECTION_WIDTHS.variants, force);
    if (variantsCount) console.log(`    variants: ${variantsCount} thumbnails`);

    // Packshots
    const packshotsDir = path.join(catalogPath, 'packshots');
    const packshotsCount = await processDirectory(
      packshotsDir,
      SECTION_WIDTHS.packshots,
      force,
    );
    if (packshotsCount) console.log(`    packshots: ${packshotsCount} thumbnails`);

    // Materials (split logic)
    const materialsDir = path.join(catalogPath, 'materials');
    const materialsCount = await processMaterialsDirectory(materialsDir, force);
    if (materialsCount) console.log(`    materials: ${materialsCount} thumbnails`);

    totalGenerated +=
      heroCount +
      galleryCount +
      overviewCount +
      variantsCount +
      packshotsCount +
      materialsCount;
  }

  const manifestEntries = await writeResponsiveManifest();
  console.log(`\nUpdated responsive image manifest for ${manifestEntries} assets.`);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nDone. Generated ${totalGenerated} thumbnails in ${elapsed}s.`);
}

main().catch((err) => {
  console.error('Thumbnail generation failed:', err);
  process.exit(1);
});
