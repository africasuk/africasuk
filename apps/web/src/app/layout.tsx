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

export const metadata: Metadata = {
  title: "AfricaSuk",
  description: "Shop Africa with Confidence.",
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