import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.blingbids.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "imgen.x.ai" },
      { protocol: "https", hostname: "**.x.ai" },
    ],
  },
};

export default nextConfig;