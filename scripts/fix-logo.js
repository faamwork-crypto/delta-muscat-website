/**
 * One-off fix: remove the blue streak on the last "A" of the DELTA wordmark in
 * the light logo. Blue-tinted pixels left of the triangle mark become white,
 * keeping their original alpha so anti-aliasing survives.
 */
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "public", "brand", "delta-muscat-logo-light.png");

(async () => {
  const img = sharp(SRC);
  const { width, height } = await img.metadata();
  const raw = await img.ensureAlpha().raw().toBuffer();

  // Pass 1: report where blue-ish pixels live so the triangle mark is excluded.
  let minX = width, maxX = 0, minY = height, maxY = 0, count = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = raw[i], g = raw[i + 1], b = raw[i + 2], a = raw[i + 3];
      if (a > 20 && b > r + 25 && b > g + 10) {
        count++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log(`size ${width}x${height}, blue pixels: ${count}, x range ${minX}-${maxX}, y range ${minY}-${maxY}`);

  // Histogram of blue pixels per 8px column band to locate the A/triangle gap.
  const bands = {};
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = raw[i], g = raw[i + 1], b = raw[i + 2], a = raw[i + 3];
      if (a > 20 && b > r + 25 && b > g + 10) {
        const band = Math.floor(x / 8) * 8;
        bands[band] = (bands[band] || 0) + 1;
      }
    }
  }
  console.log(Object.entries(bands).map(([b, c]) => `${b}:${c}`).join(" "));

  // Pass 2: recolor blue-ish pixels left of the triangle mark (x < 720) to
  // white, preserving alpha so anti-aliased edges stay smooth.
  const CUT = 720;
  let fixed = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < CUT; x++) {
      const i = (y * width + x) * 4;
      const r = raw[i], g = raw[i + 1], b = raw[i + 2], a = raw[i + 3];
      if (a > 0 && b > r + 12 && b > g + 6) {
        raw[i] = 255;
        raw[i + 1] = 255;
        raw[i + 2] = 255;
        fixed++;
      }
    }
  }
  await sharp(raw, { raw: { width, height, channels: 4 } }).png().toFile(SRC);
  console.log(`fixed ${fixed} pixels -> ${SRC}`);
})();
