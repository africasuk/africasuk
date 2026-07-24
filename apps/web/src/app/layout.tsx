import type { Metadata } from "next";
import { cookies } from "next/headers";

import {
  defaultLocale,
  getDictionary,
  getDirection,
  type Locale,
} from "@africasuk/i18n";

import {
  ExchangeRateRepository,
} from "@africasuk/database";

import {
  ExchangeRateService,
} from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { LanguageProvider } from "@/components/providers/LanguageProvider";


import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { CurrencyProvider } from "providers/CurrencyProvider";
import { ExchangeRateProvider } from "providers/ExchangeRateProvider";
import { OrganizationJsonLd, WebsiteJsonLd, } from "./structured-data";

export const metadata: Metadata = {
  metadataBase: new URL("https://africasuk.com"),

  applicationName: "AfricaSuk",

  title: {
    default:
      "AfricaSuk | South Sudan's Trusted Online Marketplace",
    template: "%s | AfricaSuk",
  },

  description:
    "AfricaSuk is South Sudan's trusted online marketplace. Shop electronics, smartphones, fashion, groceries, beauty, home appliances, automotive products, and more with secure payments and reliable delivery. Shop South Sudan with confidence.",

  keywords: [
    "AfricaSuk",
    "South Sudan",
    "Juba",
    "South Sudan marketplace",
    "Online shopping South Sudan",
    "Ecommerce South Sudan",
    "Buy online South Sudan",
    "Shop online South Sudan",
    "Marketplace South Sudan",
    "Juba marketplace",
    "Juba online shopping",
    "Electronics South Sudan",
    "Fashion South Sudan",
    "Groceries South Sudan",
    "Beauty South Sudan",
    "Home appliances South Sudan",
    "Mobile phones South Sudan",
    "Laptops South Sudan",
    "Accessories South Sudan",
    "Online store South Sudan",
    "African marketplace",
    "Africa ecommerce",
    "Shopping Africa",
  ],

  authors: [
    {
      name: "AfricaSuk",
      url: "https://africasuk.com",
    },
  ],

  creator: "AfricaSuk",

  publisher: "AfricaSuk",

  category: "Shopping",

  classification: "South Sudan E-Commerce Marketplace",

  alternates: {
    canonical: "https://africasuk.com",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],

    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
      },
    ],

    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.webmanifest",

openGraph: {
  type: "website",
  locale: "en_US",
  url: "https://africasuk.com",
  siteName: "AfricaSuk",

  title: "AfricaSuk | South Sudan's Trusted Online Marketplace",

  description:
    "Shop electronics, fashion, groceries, beauty, home appliances, smartphones, laptops, automotive products, and more from trusted sellers across South Sudan.",

  images: [
    {
      url: "https://res.cloudinary.com/kwlkw1ta/image/upload/v1784891001/AfricaSuk_e-commerce_marketplace__202607241900_q5aayq.jpg",
      width: 1200,
      height: 630,
      alt: "AfricaSuk | South Sudan's Trusted Online Marketplace",
    },
  ],
},
twitter: {
  card: "summary_large_image",

  title: "AfricaSuk | South Sudan's Trusted Online Marketplace",

  description:
    "Discover South Sudan's trusted online marketplace for electronics, fashion, groceries, beauty, home, automotive, and more.",

  creator: "@AfricaSuk",

  images: [
    "https://res.cloudinary.com/kwlkw1ta/image/upload/v1784891001/AfricaSuk_e-commerce_marketplace__202607241900_q5aayq.jpg",
  ],
},

  appleWebApp: {
    capable: true,
    title: "AfricaSuk",
    statusBarStyle: "default",
  },

  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },

  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore =
    await cookies();

  const locale =
    (cookieStore.get("locale")
      ?.value as Locale) ??
    defaultLocale;

  const currency =
    cookieStore.get("currency")
      ?.value === "SSP"
      ? "SSP"
      : "USD";

  const dir =
    getDirection(locale);

  const dictionary =
    getDictionary(locale);

  const supabase =
    await createServerSupabaseClient();

  const exchangeRateService =
    new ExchangeRateService(
      new ExchangeRateRepository(
        supabase,
      ),
    );

  const currentRate =
    await exchangeRateService.getCurrent();

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="bg-background font-sans antialiased text-foreground">
      <OrganizationJsonLd />
      <WebsiteJsonLd />
        <LanguageProvider
          locale={locale}
          dictionary={dictionary}
        >
          <CurrencyProvider
            initialCurrency={currency}
          >
            <ExchangeRateProvider
              initialRate={
                currentRate?.rate ?? 1
              }
            >
              {children}

              <Toaster
                richColors
                position="top-right"
                closeButton
                duration={4000}
              />
            </ExchangeRateProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}