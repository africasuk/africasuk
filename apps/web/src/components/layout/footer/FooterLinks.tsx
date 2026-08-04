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
    /* Responsive layout configuration */
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 py-10 text-gray-900 select-none antialiased">
      
      {/* COLUMN 1: BRAND LOGO & CORE SLOGAN DESCRIPTION */}
      <div className="col-span-2 md:col-span-1 flex flex-col items-start gap-3">
        <Logo />
        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xs">
          Shop with Confidence.
        </p>
      </div>

      {/* COLUMN 2: E-COMMERCE SHOP DEEP LINKS */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#005c2e]">
          Shop
        </h3>
        <ul className="flex flex-col gap-2.5 text-xs font-semibold text-gray-600">
          {[
            { name: "All Categories", href: "/categories" },
            { name: "New Arrivals", href: "/products" },
            { name: "Premium Brands", href: "/brands" },
            { name: "Products Request", href: "/request-product" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => handleClick(item.href)}
                className="inline-flex items-center gap-2 hover:text-[#005c2e] transition-colors"
              >
                <span>{item.name}</span>
                {loadingHref === item.href && (
                  <Loader2 className="h-3 w-3 animate-spin text-[#005c2e]" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* COLUMN 3: INTERNAL CORPORATE INFORMATION */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#005c2e]">
          Company
        </h3>
        <ul className="flex flex-col gap-2.5 text-xs font-semibold text-gray-600">
          {[
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Privacy Policy", href: "/privacy" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => handleClick(item.href)}
                className="inline-flex items-center gap-2 hover:text-[#005c2e] transition-colors"
              >
                <span>{item.name}</span>
                {loadingHref === item.href && (
                  <Loader2 className="h-3 w-3 animate-spin text-[#005c2e]" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* COLUMN 4: CUSTOMER SUPPORT HUBS */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#005c2e]">
          Support
        </h3>
        <ul className="flex flex-col gap-2.5 text-xs font-semibold text-gray-600">
          {[
            { name: "Help Center", href: "/help" },
            { name: "Track Order", href: "/account/orders" },
            { name: "Returns & Refunds", href: "/returns" },
            { name: "Contact Us", href: "/contact" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => handleClick(item.href)}
                className="inline-flex items-center gap-2 hover:text-[#005c2e] transition-colors"
              >
                <span>{item.name}</span>
                {loadingHref === item.href && (
                  <Loader2 className="h-3 w-3 animate-spin text-[#005c2e]" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}