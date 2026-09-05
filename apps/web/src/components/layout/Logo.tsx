"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useTranslation } from "@/components/providers/LanguageProvider";

interface LogoProps {
  size?: "default" | "lg" | "xl";
}

export default function Logo({ size = "default" }: LogoProps) {
  const { dictionary } = useTranslation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const delay = isActive ? 5000 : 3000;

    const timeoutId = setTimeout(() => {
      setIsActive((prev) => !prev);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [isActive]);

  // Size mapping variations
  const sizeStyles = {
    default: {
      box: "h-9.5 w-9.5",
      text: "text-xl",
      sizes: "(max-width: 768px) 76px, 120px",
    },
    lg: {
      box: "h-14 w-14 sm:h-16 sm:w-16",
      text: "text-2xl sm:text-3xl",
      sizes: "(max-width: 768px) 150px, 200px",
    },
    xl: {
      box: "h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28",
      text: "text-3xl sm:text-4xl lg:text-5xl",
      sizes: "(max-width: 768px) 250px, 350px",
    },
  };

  const current = sizeStyles[size];

  return (
    <Link
      href="/"
      className="group flex select-none items-center gap-3 sm:gap-4"
      aria-label={`${dictionary.common.brandName} - Return to Homepage`}
    >
      {/* Visual Icon (Logo Image) */}
      <div
        className={`relative ${current.box} shrink-0 transition-transform duration-500 group-hover:rotate-6`}
      >
        <Image
          src="/greenLogo.png"
          alt={dictionary.common.logoAlt || dictionary.common.brandName}
          fill
          quality={100}
          sizes={current.sizes}
          priority
          className="object-contain image-rendering-crisp"
          style={{
            imageRendering: "-webkit-optimize-contrast",
          }}
        />
      </div>

      {/* Brand Text & Dynamic Underline */}
      <div className="relative pb-1">
        <h2 className={`${current.text} font-semibold tracking-tight text-[#002b15]`}>
          {dictionary.common.brandName}
        </h2>

        <span
          className={`absolute bottom-0 right-0 h-0.5 rounded-full bg-[#002b15] transition-all duration-1000 ease-in-out group-hover:left-0 group-hover:w-full ${
            isActive ? "left-0 w-full" : "left-auto w-0"
          }`}
        />
      </div>
    </Link>
  );
}