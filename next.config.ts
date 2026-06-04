import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Real scraper source: src/lib/scrapers/shopee.ts
      // image_url = `https://cf.shopee.co.id/file/${raw.image}`
      {
        protocol: "https",
        hostname: "cf.shopee.co.id",
        pathname: "/file/**",
      },
      // seed.sql uses fake images.tokopedia.net URLs that won't resolve
      // in production, but allow the host so <Image> doesn't error
      // if any seed rows survive.
      {
        protocol: "https",
        hostname: "images.tokopedia.net",
      },
    ],
  },
};

export default nextConfig;