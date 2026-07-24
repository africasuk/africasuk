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
          "/_next/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
    ],

    sitemap: "https://africasuk.com/sitemap.xml",

    // Remove the protocol from host
    host: "africasuk.com",
  };
}