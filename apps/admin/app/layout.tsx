import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "AfricaSuk Admin",
    template: "%s | AfricaSuk Admin",
  },
  description: "AfricaSuk Marketplace Administration Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<html lang="en" suppressHydrationWarning>
  <body className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider delayDuration={0}>
        {children}

        <Toaster
          richColors
          closeButton
          position="top-right"
        />
      </TooltipProvider>
    </ThemeProvider>
  </body>
</html>
  );
}