import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/checkout/",
          "/cart/",
          "/account/",
          "/orders/",
          "/wishlist/",
        ],
      },
    ],
    sitemap: "https://africasuk.com/sitemap.xml",
    host: "https://africasuk.com",
  };
}