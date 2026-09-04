import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/terms/",
          "/delete-account/",
          "/returns/",
          "/request-product/",
        ],
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
      {
        userAgent: "Googlebot",
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
      {
        userAgent: "Bingbot",
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
    host: "africasuk.com",
  };
}