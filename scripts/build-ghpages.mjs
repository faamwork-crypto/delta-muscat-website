/**
 * GitHub Pages build pipeline (run via `npm run build:ghpages`):
 * 1. sets the GH Pages environment (base path, canonical URL),
 * 2. runs `next build` in static-export mode,
 * 3. post-processes ./out:
 *    - .nojekyll (so GitHub serves the _next/ asset folder)
 *    - /index.html redirecting to /en/ (static replacement for the removed
 *      locale-redirect proxy, which GitHub Pages cannot run)
 *    - /404.html copied from the localized 404 page
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const env = {
  ...process.env,
  NEXT_DEPLOY_TARGET: "ghpages",
  NEXT_PUBLIC_BASE_PATH: "/delta-muscat-website",
  NEXT_PUBLIC_SITE_URL: "https://faamwork-crypto.github.io/delta-muscat-website",
  NEXT_TELEMETRY_DISABLED: "1",
};

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env,
});
if (result.status !== 0) process.exit(result.status ?? 1);

const out = join(process.cwd(), "out");
if (!existsSync(out)) {
  console.error("Export output ./out not found");
  process.exit(1);
}

// GitHub Pages must serve the _next/ folder as-is.
writeFileSync(join(out, ".nojekyll"), "");

// Static root redirect to the default locale.
writeFileSync(
  join(out, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Delta Muscat Steel &amp; Aluminium</title>
    <meta http-equiv="refresh" content="0; url=/delta-muscat-website/en/" />
    <link rel="canonical" href="/delta-muscat-website/en/" />
    <script>location.replace("/delta-muscat-website/en/");</script>
    <style>body{background:#191917;color:#f7f4ee;font-family:sans-serif;display:grid;place-items:center;height:100vh;margin:0}
    a{color:#c9a876}</style>
  </head>
  <body>
    <noscript><p>Redirecting to <a href="/delta-muscat-website/en/">Delta Muscat Steel &amp; Aluminium — English</a></p></noscript>
  </body>
</html>
`
);

// Localized 404 becomes the site-wide 404 page.
for (const candidate of [join(out, "en", "404.html"), join(out, "en", "404", "index.html")]) {
  if (existsSync(candidate)) {
    copyFileSync(candidate, join(out, "404.html"));
    console.log("Copied 404.html from", candidate);
    break;
  }
}

console.log("GitHub Pages export ready in ./out");
