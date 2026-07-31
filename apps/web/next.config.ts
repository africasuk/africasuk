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
    qualities: [75, 80, 85, 90],

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