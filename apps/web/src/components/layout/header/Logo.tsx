"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useTranslation } from "@/components/providers/LanguageProvider";

export default function Logo() {
  const { dictionary } = useTranslation();

  const [isActive, setIsActive] = useState(false);

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
      className="flex select-none items-center gap-3"
    >
      <div className="relative h-9 w-9 shrink-0">
        <Image
          src="/logo.png"
          alt={dictionary.common.logoAlt}
          fill
          sizes="36px"
          className="object-contain"
          priority
        />
      </div>

      <div className="relative pb-1">
        <h2 className="text-xl font-black tracking-tight text-[#004d26]">
          {dictionary.common.brandName}
        </h2>

        <span
          className={`absolute bottom-0 right-0 h-0.5 bg-[#004d26] transition-all duration-1000 ease-in-out ${
            isActive
              ? "left-0 w-full"
              : "left-auto w-0"
          }`}
        />
      </div>
    </Link>
  );
}