// Tiny static file server that emulates GitHub Pages project-site behavior:
// serves ./out under the /delta-muscat-website base path, maps extensionless
// paths to index.html. Usage: node scripts/serve-export.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const PORT = Number(process.argv[2] ?? 4173);
const BASE = "/delta-muscat-website";
const ROOT = join(process.cwd(), "out");
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

createServer(async (req, res) => {
  try {
    let url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (!url.startsWith(BASE)) {
      // GH Pages would 404/redirect here; serve the root redirect page at "/"
      if (url === "/") {
        const buf = await readFile(join(ROOT, "index.html"));
        res.writeHead(200, { "content-type": MIME[".html"] }).end(buf);
        return;
      }
      res.writeHead(404).end("not found (missing base path)");
      return;
    }
    let rel = url.slice(BASE.length) || "/";
    let file = join(ROOT, normalize(rel).replace(/^([.][.][\/\\])+/, ""));
    let s = await stat(file).catch(() => null);
    if (s?.isDirectory()) {
      file = join(file, "index.html");
      s = await stat(file).catch(() => null);
    } else if (!s && !extname(file)) {
      file = join(file, "index.html");
      s = await stat(file).catch(() => null);
    }
    if (!s) {
      const buf = await readFile(join(ROOT, "404.html")).catch(() => null);
      res.writeHead(404, { "content-type": MIME[".html"] }).end(buf ?? "404");
      return;
    }
    const buf = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }).end(buf);
  } catch {
    res.writeHead(500).end("server error");
  }
}).listen(PORT, () => console.log(`Serving ./out at http://localhost:${PORT}${BASE}/`));
