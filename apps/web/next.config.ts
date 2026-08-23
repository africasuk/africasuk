import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@africasuk/api",
    "@africasuk/database",
    "@africasuk/types",
    "@africasuk/validation",
    "@africasuk/i18n",
  ],

  images: {
    qualities: [75],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [32, 48, 64, 96, 128, 256],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "gzfhrrnvstoeoaxdsbxc.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;