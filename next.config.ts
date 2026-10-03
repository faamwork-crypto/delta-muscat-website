import type { NextConfig } from "next";

/**
 * Two build modes:
 * - default: Node server build (npm run build) — used for local production
 *   preview and Vercel-style hosting.
 * - GitHub Pages: NEXT_DEPLOY_TARGET=ghpages produces a fully static export
 *   under /delta-muscat-website via scripts/build-ghpages.mjs.
 */
const isGitHubPages = process.env.NEXT_DEPLOY_TARGET === "ghpages";
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
  poweredByHeader: false,
  experimental: {
    // Keep the build footprint small on space-constrained machines;
    // re-enable for faster incremental builds if disk allows.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
