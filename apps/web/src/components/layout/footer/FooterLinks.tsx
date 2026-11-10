
"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ShieldCheck } from "lucide-react";
import Logo from "../header/Logo";

interface FooterLink {
  name: string;
  href: string;
}

export default function FooterLinks() {
  const [loadingHref, setLoadingHref] = useState<string | null>(null);

  const handleClick = (href: string) => {
    setLoadingHref(href);
  };

  const shopLinks: FooterLink[] = [
    { name: "All Categories", href: "/categories" },
    { name: "New Arrivals", href: "/products" },
    { name: "Popular Brands", href: "/brands" },
    { name: "Request a Product", href: "/request-product" },
  ];

  const companyLinks: FooterLink[] = [
    { name: "About Africa Suk", href: "/about" },
    { name: "Business Information", href: "/business-information" },
    { name: "Careers", href: "/careers" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
  ];

  const supportLinks: FooterLink[] = [
    { name: "Help Center", href: "/help" },
    { name: "Shipping & Delivery", href: "/shipping" },
    { name: "Payment Information", href: "/payment-information" },
    { name: "Returns & Refunds", href: "/returns" },
    { name: "Contact Us", href: "/contact" },
  ];

  const renderLinks = (links: FooterLink[]) => (
    <ul className="flex flex-col gap-2 text-sm font-medium text-gray-600">
      {links.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={() => handleClick(item.href)}
            aria-label={item.name}
            className="group relative inline-flex items-center gap-2 pb-0.5 transition-colors hover:text-[#002b15]"
          >
            <span>{item.name}</span>

            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#002b15]/20 transition-all duration-300 group-hover:w-full" />

            {loadingHref === item.href && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#002b15]" />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 text-gray-900 antialiased selection:bg-[#002b15]/10 md:grid-cols-4">
      {/* Brand */}
      <div className="col-span-2 flex flex-col items-start gap-4 md:col-span-1">
        <Logo />

        <p className="max-w-xs text-sm font-normal leading-relaxed text-gray-500">
          South Sudan&apos;s online marketplace. Discover quality products,
          enjoy convenient shopping, and shop with confidence.
        </p>

        <div className="flex items-center gap-2 text-sm font-semibold text-[#004d26]">
          <ShieldCheck className="h-4 w-4" />
          <span>Shop with Confidence</span>
        </div>
      </div>

      {/* Shop */}
      <div className="flex flex-col gap-3.5">
        <h3 className="text-sm font-semibold tracking-tight text-[#002b15]">
          Shop
        </h3>

        {renderLinks(shopLinks)}
      </div>

      {/* Company */}
      <div className="flex flex-col gap-3.5">
        <h3 className="text-sm font-semibold tracking-tight text-[#002b15]">
          Company
        </h3>

        {renderLinks(companyLinks)}
      </div>

      {/* Support */}
      <div className="flex flex-col gap-3.5">
        <h3 className="text-sm font-semibold tracking-tight text-[#002b15]">
          Support
        </h3>

        {renderLinks(supportLinks)}
      </div>
    </div>
  );
}
