"use client";

import Link from "next/link";
import Logo from "../header/Logo"; // Adjust path to your actual Logo component layout

export default function FooterLinks() {
  return (
    /* Responsive layout configuration: shifts to 2 columns on mobile to maintain vertical spacing */
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 py-10 text-gray-900 select-none antialiased">
      
      {/* COLUMN 1: BRAND LOGO & CORE SLOGAN DESCRIPTION */}
      <div className="col-span-2 md:col-span-1 flex flex-col items-start gap-3">
        <Logo />
        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xs">
          Sourcing verified premium global brands and hardware directly to your collection.
        </p>
      </div>

      {/* COLUMN 2: E-COMMERCE SHOP DEEP LINKS */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#005c2e]">
          Shop
        </h3>
        <ul className="flex flex-col gap-2.5 text-xs font-semibold text-gray-600">
          <li>
            <Link href="/categories" className="hover:text-[#005c2e] transition-colors">
              All Categories
            </Link>
          </li>
          <li>
            <Link href="/new-arrivals" className="hover:text-[#005c2e] transition-colors">
              New Arrivals
            </Link>
          </li>
          <li>
            <Link href="/brands" className="hover:text-[#005c2e] transition-colors">
              Premium Brands
            </Link>
          </li>
          <li>
            <Link href="/request-product" className="hover:text-[#005c2e] transition-colors">
              Products Request
            </Link>
          </li>
        </ul>
      </div>

      {/* COLUMN 3: INTERNAL CORPORATE INFORMATION */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#005c2e]">
          Company
        </h3>
        <ul className="flex flex-col gap-2.5 text-xs font-semibold text-gray-600">
          <li>
            <Link href="/about" className="hover:text-[#005c2e] transition-colors">
              About Us
            </Link>
          </li>
          <li>
            <Link href="/careers" className="hover:text-[#005c2e] transition-colors">
              Careers
            </Link>
          </li>
          <li>
            <Link href="/terms" className="hover:text-[#005c2e] transition-colors">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link href="/PrivacyPolicy" className="hover:text-[#005c2e] transition-colors">
              Privacy Policy
            </Link>
          </li>
        </ul>
      </div>

      {/* COLUMN 4: CUSTOMER SUPPORT HUBS */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#005c2e]">
          Support
        </h3>
        <ul className="flex flex-col gap-2.5 text-xs font-semibold text-gray-600">
          <li>
            <Link href="/help" className="hover:text-[#005c2e] transition-colors">
              Help Center
            </Link>
          </li>
          <li>
            <Link href="/account/orders" className="hover:text-[#005c2e] transition-colors">
              Track Order
            </Link>
          </li>
          <li>
            <Link href="/returns" className="hover:text-[#005c2e] transition-colors">
              Returns & Refunds
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-[#005c2e] transition-colors">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>

    </div>
  );
}