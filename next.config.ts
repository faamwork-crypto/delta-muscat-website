import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Keep the build footprint small on space-constrained machines;
    // re-enable for faster incremental builds if disk allows.
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;
