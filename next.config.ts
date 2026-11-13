import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Public content is statically generated. Avoid Activity/PPR state retention
  // so back/forward navigation and hash restoration use ordinary route lifecycles.
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
