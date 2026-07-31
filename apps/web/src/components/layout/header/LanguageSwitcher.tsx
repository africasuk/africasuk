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
    flagUrl: "https://flagcdn.com/gb.svg",
  },
  ar: {
    label: "العربية",
    code: "AR",
    flagUrl: "https://flagcdn.com/sa.svg",
  },
} as const;

type Locale = keyof typeof LANGUAGES;

export default function LanguageSwitcher() {
  const router = useRouter();

  const [currentLocale, setCurrentLocale] = useState<Locale>(
    typeof document !== "undefined"
      ? ((document.cookie.match(/(^| )locale=([^;]+)/)?.[2] as Locale) ?? "en")
      : "en"
  );

  function changeLanguage(locale: Locale) {
    document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrentLocale(locale);
    router.refresh();
  }

  const activeLang = LANGUAGES[currentLocale];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group relative flex w-12 flex-col items-center justify-center gap-1 rounded-lg border-none bg-transparent px-2 py-1.5 text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:text-[#004d26] focus:outline-none sm:w-14">
        <Globe className="h-5 w-5 transition-transform group-hover:scale-105" />

        <div className="flex items-center gap-0.5 text-[10px] font-medium tracking-wide">
          <span>{activeLang.code}</span>

          <div className="relative h-2 w-3 shrink-0 overflow-hidden rounded-2xs border border-neutral-200 shadow-2xs">
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
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="z-50 min-w-32 border border-neutral-200 bg-white"
      >
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className="flex cursor-pointer items-center gap-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <div className="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-xs border border-neutral-200 shadow-sm">
            <Image
              src={LANGUAGES.en.flagUrl}
              alt="English"
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
          className="flex cursor-pointer items-center gap-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <div className="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-xs border border-neutral-200 shadow-sm">
            <Image
              src={LANGUAGES.ar.flagUrl}
              alt="Arabic"
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