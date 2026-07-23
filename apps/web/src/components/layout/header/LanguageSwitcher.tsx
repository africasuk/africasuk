"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = {
  en: { 
    label: "English", 
    code: "EN",
    flagUrl: "https://flagcdn.com/gb.svg" 
  },
  ar: { 
    label: "العربية", 
    code: "AR",
    flagUrl: "https://flagcdn.com/sa.svg" 
  },
} as const;

type Locale = keyof typeof LANGUAGES;

export default function LanguageSwitcher() {
  const router = useRouter();

  const [currentLocale, setCurrentLocale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    const match = document.cookie.match(/(^| )locale=([^;]+)/);
    if (match && (match[2] === "en" || match[2] === "ar")) {
      return match[2] as Locale;
    }
    return "en";
  });

  function changeLanguage(locale: Locale) {
    document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrentLocale(locale);
    router.refresh();
  }

  const activeLang = LANGUAGES[currentLocale];

  return (
    <DropdownMenu>
      {/* 
        asChild wraps a standard button so the click target acts exactly 
        like OrdersButton, WishlistButton, and CartButton.
      */}
      <DropdownMenuTrigger asChild>
        <button className="group relative flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:text-[#004d26] focus:outline-none select-none cursor-pointer border-none bg-transparent p-0 w-12 sm:w-14">
          <Globe className="h-5 w-5 transition-transform group-hover:scale-105" />
          
          <div className="flex items-center gap-0.5 text-[10px] font-medium tracking-wide">
            <span>{activeLang.code}</span>
            
            {/* Inline vector flag badge */}
            <div className="relative h-2 w-3 overflow-hidden rounded-2xs border border-neutral-200 shadow-2xs shrink-0">
              <Image
                src={activeLang.flagUrl}
                alt=""
                fill
                sizes="12px"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>

      {/* Dropdown Options List */}
      <DropdownMenuContent align="end" className="min-w-32 z-50 bg-white border border-neutral-200">
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className="flex items-center gap-3 cursor-pointer font-medium hover:bg-neutral-50 text-neutral-700 text-sm"
        >
          <div className="relative h-3.5 w-5 overflow-hidden rounded-xs border border-neutral-200 shadow-sm shrink-0">
            <Image
              src={LANGUAGES.en.flagUrl}
              alt="English Menu Option"
              fill
              sizes="20px"
              className="object-cover"
              unoptimized
            />
          </div>
          <span>{LANGUAGES.en.label}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => changeLanguage("ar")}
          className="flex items-center gap-3 cursor-pointer font-medium justify-between hover:bg-neutral-50 text-neutral-700 text-sm"
        >
          <div className="relative h-3.5 w-5 overflow-hidden rounded-xs border border-neutral-200 shadow-sm shrink-0">
            <Image
              src={LANGUAGES.ar.flagUrl}
              alt="Arabic Menu Option"
              fill
              sizes="20px"
              className="object-cover"
              unoptimized
            />
          </div>
          <span>{LANGUAGES.ar.label}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}