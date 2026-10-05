import type { NextConfig } from "next";

/**
 * Build modes:
 * - default: Node server build (npm run build) — used for local production
 *   preview and Vercel-style hosting.
 * - NEXT_DEPLOY_TARGET=ghpages: static export under /delta-muscat-website
 *   (GitHub Pages) via scripts/build-ghpages.mjs.
 * - NEXT_DEPLOY_TARGET=static: static export at the domain root (own hosting,
 *   e.g. cPanel) — same export, no base path, no asset prefix. Built by
 *   scripts/build-host.mjs which also packages the upload zip.
 */
const isGitHubPages = process.env.NEXT_DEPLOY_TARGET === "ghpages";
const isRootStatic = process.env.NEXT_DEPLOY_TARGET === "static";
const basePath = "/delta-muscat-website";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export" as const,
        basePath,
        assetPrefix: basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(isRootStatic
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  poweredByHeader: false,
  experimental: {
    // Keep the build footprint small on space-constrained machines;
    // re-enable for faster incremental builds if disk allows.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
