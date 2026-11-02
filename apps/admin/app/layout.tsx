
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist } from "next/font/google";

import "./globals.css";

import {
  ExchangeRateRepository,
} from "@africasuk/database";
import {
  ExchangeRateService,
} from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { CurrencyProvider } from "@/providers/CurrencyProvider";
import { ExchangeRateProvider } from "@/providers/ExchangeRateProvider";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://orion.africasuk.com"),

  title: {
    default: "Orion",
    template: "%s | Orion",
  },

  description: "AfricaSuk Internal Administration Portal",
  applicationName: "Orion",

  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": -1,
      "max-image-preview": "none",
      "max-video-preview": -1,
    },
  },

  referrer: "strict-origin-when-cross-origin",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.webmanifest",
  category: "Administration",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f172a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const currency =
    cookieStore.get("currency")?.value === "USD"
      ? "USD"
      : "SSP";

  const supabase = await createServerSupabaseClient();

  const exchangeRateService = new ExchangeRateService(
    new ExchangeRateRepository(supabase)
  );

  const currentRate = await exchangeRateService.getCurrent();

  const initialRate = currentRate?.rate ?? 1;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <body
        className={`${geist.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider initialCurrency={currency}>
            <ExchangeRateProvider initialRate={initialRate}>
              <TooltipProvider>
                {children}

                <Toaster
                  richColors
                  closeButton
                  position="top-right"
                />
              </TooltipProvider>
            </ExchangeRateProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
