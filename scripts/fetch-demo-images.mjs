/**
 * Crawl the reference demo site and extract every image URL found in page
 * HTML (img src, srcset, og:image, CSS url()).
 * Usage: node scripts/fetch-demo-images.mjs [list|download]
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, basename, extname } from "node:path";

const BASE = "https://delta-muscat-factory.vercel.app";
const PAGES = [
  "/en/",
  "/en/about",
  "/en/solutions",
  "/en/solutions/pergolas",
  "/en/solutions/parking-shades",
  "/en/solutions/shade-structures",
  "/en/solutions/metal-decoration",
  "/en/sectors",
  "/en/process",
  "/en/materials",
  "/en/gallery",
  "/en/contact",
];
const OUT_DIR = join(process.cwd(), "downloads", "demo-images");

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function extractUrls(html) {
  const urls = new Set();
  const patterns = [
    /src="([^"]+?\.(?:jpg|jpeg|png|webp|avif|svg)(?:\?[^"]*)?)"/gi,
    /srcset="([^"]+?\.(?:jpg|jpeg|png|webp|avif|svg)[^"]*)"/gi,
    /content="(https?:[^"]+?\.(?:jpg|jpeg|png|webp|avif|svg)[^"]*)"/gi,
    /url\((['"]?)([^)'"]+?\.(?:jpg|jpeg|png|webp|avif|svg))\1\)/gi,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(html))) {
      let u = m[2] ?? m[1];
      if (!u) continue;
      if (u.startsWith("/")) u = BASE + u;
      if (u.startsWith("http")) urls.add(u.split(" ")[0]);
    }
  }
  return [...urls];
}

const mode = process.argv[2] ?? "list";
const all = new Map(); // url -> pages

for (const page of PAGES) {
  try {
    const html = await fetchText(BASE + page);
    for (const u of extractUrls(html)) {
      if (!all.has(u)) all.set(u, []);
      all.get(u).push(page);
    }
    console.error(`✓ ${page} (${html.length} bytes)`);
  } catch (e) {
    console.error(`✗ ${page}: ${e.message}`);
  }
}

const urls = [...all.keys()];
console.log(`\nFound ${urls.length} unique image URLs:\n`);
for (const u of urls) console.log(u, "   <-", [...new Set(all.get(u))].join(", "));

if (mode === "download") {
  mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0;
  for (const u of urls) {
    try {
      const res = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(String(res.status));
      const buf = Buffer.from(await res.arrayBuffer());
      let name = decodeURIComponent(new URL(u).pathname.split("/").pop() || "img");
      // keep query-differentiated names (Next image optimizer ?url=...&w=...)
      if (new URL(u).search) name = name.replace(/\.\w+$/, "") + "-" + Buffer.from(u).toString("base64url").slice(-8) + extname(name);
      if (existsSync(join(OUT_DIR, name))) name = name.replace(/(\.\w+)$/, "-dup$1");
      writeFileSync(join(OUT_DIR, name), buf);
      ok++;
      console.error(`↓ ${name} (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.error(`✗ ${u}: ${e.message}`);
    }
  }
  console.log(`\nDownloaded ${ok}/${urls.length} to ${OUT_DIR}`);
}
