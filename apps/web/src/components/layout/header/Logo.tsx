"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useTranslation } from "@/components/providers/LanguageProvider";

export default function Logo() {
  const { dictionary } = useTranslation();

  // Subtle Animation State (Automatic Pulse)
  const [isActive, setIsActive] = useState(false);

  // Automatic pulse logic (Toggles underlining periodically)
  useEffect(() => {
    const delay = isActive ? 5000 : 3000;

    const timeoutId = setTimeout(() => {
      setIsActive((prev) => !prev);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  return (
    <Link
      href="/"
      className="group flex select-none items-center gap-2.5"
      aria-label={`${dictionary.common.brandName} - Return to Homepage`}
    >
      {/* Visual Icon (Logo Image) */}
      <div className="relative h-9.5 w-9.5 shrink-0 transition-transform duration-500 group-hover:rotate-6">
        <Image
          src="/logo.png"
          // Defaulting to brandName ensures structural robustness if alt key is missing
          alt={dictionary.common.logoAlt || dictionary.common.brandName}
          fill
          sizes="38px"
          className="object-contain"
          priority
        />
      </div>

      {/* Brand Text & High-End Dynamic Underline */}
      <div className="relative pb-1">
        {/*
          Typography Changes:
          - font-black -> font-semibold (Upscale, modern feel)
          - text-[#004d26] -> text-[#002b15] (Eucalyptus Green - Deep, rich, organic)
          - Uppercase -> Sentence Case (Modern industry standard for premium branding)
        */}
        <h2 className="text-xl font-semibold tracking-tight text-[#002b15]">
          {dictionary.common.brandName}
        </h2>

        {/*
          Luxury Dynamic Underline:
          - Triggers automatically via isActive
          - Also triggers instantly on group-hover for instant user feedback
        */}
        <span
          className={`absolute bottom-0 right-0 h-0.5 rounded-full bg-[#002b15] transition-all duration-1000 ease-in-out group-hover:left-0 group-hover:w-full ${
            isActive ? "left-0 w-full" : "left-auto w-0"
          }`}
        />
      </div>
    </Link>
  );
}