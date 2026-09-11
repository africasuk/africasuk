"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "@/components/providers/LanguageProvider";

export default function Logo() {
  const { dictionary } = useTranslation();

  // Subtle automatic animation state
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const delay = isActive ? 5000 : 3000;

    const timeoutId = setTimeout(() => {
      setIsActive((prev) => !prev);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  const brandName = dictionary.common.brandName || "Africa Suk";
  const logoAlt = dictionary.common.logoAlt || "Africa Suk";

  return (
    <Link
      href="/"
      className="group flex select-none items-center gap-2.5"
      aria-label={`${brandName} - Return to Homepage`}
    >
      {/* Africa Suk Logo */}
      <div className="relative h-9.5 w-9.5 shrink-0 transition-transform duration-500 group-hover:rotate-6">
        <Image
          src="/Newlogo.png"
          alt={logoAlt}
          fill
          sizes="38px"
          className="object-contain"
          priority
        />
      </div>

      {/* Brand Name */}
      <div className="relative pb-1">
        <h2 className="text-xl font-semibold tracking-tight text-[#002b15]">
          {brandName}
        </h2>

        {/* Subtle Brand Accent */}
        <span
          className={`absolute bottom-0 right-0 h-0.5 rounded-full bg-[#002b15] transition-all duration-1000 ease-in-out group-hover:left-0 group-hover:w-full ${
            isActive ? "left-0 w-full" : "left-auto w-0"
          }`}
        />
      </div>
    </Link>
  );
}