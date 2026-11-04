import type { MetadataRoute } from "next";

const sitemap = "https://africasuk.com/sitemap.xml";

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
    sitemap,
    host: "https://africasuk.com",
  };
}