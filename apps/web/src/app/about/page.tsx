
import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "Africa Suk | South Sudan's Online Shopping Marketplace",

  description:
    "Africa Suk is South Sudan's online shopping marketplace. Shop electronics, fashion, beauty, home products, everyday essentials and more through our website and mobile app. Shop with Confidence.",

  keywords: [
    "Africa Suk",
    "South Sudan online shopping",
    "South Sudan online marketplace",
    "online shopping in South Sudan",
    "online store South Sudan",
    "shop online South Sudan",
    "South Sudan shopping platform",
    "buy products online South Sudan",
    "electronics South Sudan",
    "fashion South Sudan",
    "product delivery South Sudan",
  ],

  alternates: {
    canonical: "/about",
  },

  openGraph: {
    type: "website",
    title: "About Africa Suk | South Sudan's Online Shopping Marketplace",
    description:
      "Discover Africa Suk, a South Sudanese online marketplace bringing products together in one convenient place. Shop with Confidence.",
    url: "https://africasuk.com/about",
    siteName: "Africa Suk",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Africa Suk - South Sudan Online Shopping Marketplace",
      },
    ],
  },

  twitter: {
    card: "summary",
    title: "Africa Suk | South Sudan's Online Shopping Marketplace",
    description:
      "Shop electronics, fashion, beauty, home products and more on South Sudan's online shopping marketplace.",
  },
};

export default function Page() {
  return <AboutPage />;
}
