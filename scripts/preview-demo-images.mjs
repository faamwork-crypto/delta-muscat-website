/**
 * Transcode downloaded demo images to PNG previews for inspection, and
 * report dimensions. Usage: node scripts/preview-demo-images.mjs
 */
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SRC = join(process.cwd(), "downloads", "demo-images");
const OUT = join(process.cwd(), "downloads", "previews");
mkdirSync(OUT, { recursive: true });

for (const file of readdirSync(SRC)) {
  const src = join(SRC, file);
  const out = join(OUT, file.replace(/\.\w+$/, ".png"));
  try {
    const meta = await sharp(src).metadata();
    await sharp(src)
      .resize({ width: 720, withoutEnlargement: true })
      .png({ quality: 90 })
      .toFile(out);
    console.log(`${file}  ${meta.width}x${meta.height}  -> previews/${file.replace(/\.\w+$/, ".png")}`);
  } catch (e) {
    console.log(`${file}  FAILED: ${e.message}`);
  }
}
