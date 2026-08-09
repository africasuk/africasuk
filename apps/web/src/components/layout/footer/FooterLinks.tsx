"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Logo from "../header/Logo";

export default function FooterLinks() {
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  const handleClick = (href: string) => {
    setLoadingHref(href);
  };

  return (
    /* Responsive grid layout config */
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 py-12 text-gray-900 select-none antialiased selection:bg-[#002b15]/10">
      
      {/* COLUMN 1: BRAND LOGO & CORE SLOGAN DESCRIPTION */}
      <div className="col-span-2 md:col-span-1 flex flex-col items-start gap-4">
        <Logo />
        <p className="text-sm text-gray-500 font-normal leading-relaxed max-w-xs opacity-80">
          Curated premium selections. Built with integrity.
        </p>
      </div>

      {/* COLUMN 2: E-COMMERCE SHOP DEEP LINKS */}
      <div className="flex flex-col gap-3.5">
        {/*
          Typography Change:
          - font-black uppercase tracking-widest -> font-semibold sentence case (Upscale, modern feel)
          - text-[#005c2e] -> text-[#002b15] (Eucalyptus Green - Deep, rich, trustworthy organic)
        */}
        <h3 className="text-sm font-semibold text-[#002b15] tracking-tight">
          Collections
        </h3>
        {/*
          Link Styles:
          - Reduced text weight font-semibold -> font-medium
          - Forced uppercase -> Sentence Case (Industry standard for modern premium branding)
          - Added luxury interactive animated underline effect on hover
        */}
        <ul className="flex flex-col gap-2 text-sm font-medium text-gray-600">
          {[
            { name: "All Categories", href: "/categories" },
            { name: "New Arrivals", href: "/products" },
            { name: "Premium Brands", href: "/brands" },
            { name: "Request Product", href: "/request-product" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => handleClick(item.href)}
                className="group relative inline-flex items-center gap-2 hover:text-[#002b15] transition-colors pb-0.5"
              >
                <span>{item.name}</span>
                {/* Luxury animated underline */}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#002b15]/20 transition-all duration-300 group-hover:w-full" />
                {loadingHref === item.href && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#002b15]" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* COLUMN 3: INTERNAL CORPORATE INFORMATION */}
      <div className="flex flex-col gap-3.5">
        <h3 className="text-sm font-semibold text-[#002b15] tracking-tight">
          Company
        </h3>
        <ul className="flex flex-col gap-2 text-sm font-medium text-gray-600">
          {[
            { name: "Our Story", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => handleClick(item.href)}
                className="group relative inline-flex items-center gap-2 hover:text-[#002b15] transition-colors pb-0.5"
              >
                <span>{item.name}</span>
                {/* Luxury animated underline */}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#002b15]/20 transition-all duration-300 group-hover:w-full" />
                {loadingHref === item.href && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#002b15]" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* COLUMN 4: CUSTOMER SUPPORT HUBS */}
      <div className="flex flex-col gap-3.5">
        <h3 className="text-sm font-semibold text-[#002b15] tracking-tight">
          Support
        </h3>
        <ul className="flex flex-col gap-2 text-sm font-medium text-gray-600">
          {[
            { name: "Help Center", href: "/help" },
            { name: "Track Order", href: "/account/orders" },
            { name: "Returns & Refunds", href: "/returns" },
            { name: "Contact Team", href: "/contact" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => handleClick(item.href)}
                className="group relative inline-flex items-center gap-2 hover:text-[#002b15] transition-colors pb-0.5"
              >
                <span>{item.name}</span>
                {/* Luxury animated underline */}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#002b15]/20 transition-all duration-300 group-hover:w-full" />
                {loadingHref === item.href && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#002b15]" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}