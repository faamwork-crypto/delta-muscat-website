/**
 * Own-hosting build pipeline (run via `npm run build:host`):
 * 1. runs `next build` in static-export mode at the domain root (no base path),
 * 2. post-processes ./out:
 *    - /index.html redirecting to /en/
 *    - /404.html copied from the localized 404 page
 *    - .htaccess (ErrorDocument for clean 404s, force-HTTPS ready)
 * 3. zips ./out into dist/delta-muscat-hosting.zip for cPanel upload.
 *
 * Domain: set NEXT_PUBLIC_SITE_URL before running so canonical/OG URLs embed
 * the final domain, e.g.:
 *   NEXT_PUBLIC_SITE_URL="https://deltamuscat.com" npm run build:host
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const env = {
  ...process.env,
  NEXT_DEPLOY_TARGET: "static",
  NEXT_TELEMETRY_DISABLED: "1",
};

const result = spawnSync("npx", ["next", "build"], { stdio: "inherit", shell: true, env });
if (result.status !== 0) process.exit(result.status ?? 1);

const out = join(process.cwd(), "out");
const dist = join(process.cwd(), "dist");

/* Root redirect to /en/ (same pattern as the GitHub Pages build). */
writeFileSync(
  join(out, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>Delta Muscat</title><script>location.replace("/en/");</script>
<link rel="canonical" href="${env.NEXT_PUBLIC_SITE_URL ?? ""}/en/">`,
);

/* Localized 404 as the site-wide 404 page. */
const notFound404 = join(out, "en", "404", "index.html");
if (existsSync(notFound404)) copyFileSync(notFound404, join(out, "404.html"));

/* .htaccess — Apache (cPanel): custom 404 page. */
writeFileSync(
  join(out, ".htaccess"),
  `ErrorDocument 404 /404.html
# Optional: uncomment after the SSL certificate is active to force HTTPS
# RewriteEngine On
# RewriteCond %{HTTPS} !=on
# RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
`,
);

/* Zip for cPanel upload (uses PowerShell Compress-Archive; .htaccess included). */
mkdirSync(dist, { recursive: true });
const zipPath = join(dist, "delta-muscat-hosting.zip");
const ps = spawnSync(
  "powershell",
  [
    "-NoProfile",
    "-Command",
    `$ErrorActionPreference='Stop'; ` +
      `if (Test-Path '${zipPath}') { Remove-Item '${zipPath}' }; ` +
      `Copy-Item '${join(out, ".htaccess")}' '${join(out, "htaccess.txt")}' -Force; ` +
      `Compress-Archive -Path '${out}\\*' -DestinationPath '${zipPath}' -Force; ` +
      `Move-Item '${join(out, "htaccess.txt")}' '${join(out, ".htaccess")}' -Force; ` +
      `Write-Host 'zip ok'`,
  ],
  { stdio: "inherit", shell: false },
);
if (ps.status !== 0) process.exit(ps.status ?? 1);

console.log(`Host export ready in ./out — upload zip: ${zipPath}`);
