
import type { MetadataRoute } from "next";

const SITE_URL = "https://africasuk.com";

const privatePaths = [
  "/admin/",
  "/api/",
  "/auth/",
  "/checkout/",
  "/cart/",
  "/account/",
  "/orders/",
  "/wishlist/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
