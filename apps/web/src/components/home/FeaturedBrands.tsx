"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, Loader2 } from "lucide-react";
import type { Brand } from "@africasuk/types";

import Container from "@/components/layout/Container";
import { Card } from "@/components/ui/card";

interface Props {
  brands: (Brand & { 
    description?: string;
  })[];
}

export default function FeaturedBrands({ brands = [] }: Props) {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [isNavigatingAll, setIsNavigatingAll] = useState(false);

  if (brands.length === 0) return null;

  // Limit grid strictly to 15 items overall
  const displayBrands = brands.slice(0, 15);

  // Grid spans: 
  // Mobile uses 2-column system (col-span-1 / col-span-2)
  // Desktop (md:) uses 12-column system for exact desktop collage
  const tileSpans = [
    // Row 1
    "col-span-1 md:col-span-2 row-span-1",
    "col-span-1 md:col-span-2 row-span-1",
    "col-span-2 md:col-span-4 row-span-1",
    "col-span-1 md:col-span-2 row-span-1",
    "col-span-1 md:col-span-2 row-span-1",

    // Row 2 & 3
    "col-span-1 md:col-span-2 row-span-1",
    "col-span-1 md:col-span-2 row-span-2", // Vertical Tall
    "col-span-2 md:col-span-4 row-span-1",
    "col-span-2 md:col-span-4 row-span-1",

    "col-span-1 md:col-span-2 row-span-1",
    "col-span-2 md:col-span-4 row-span-1",
    "col-span-1 md:col-span-2 row-span-2", // Vertical Tall

    // Row 4
    "col-span-1 md:col-span-3 row-span-1",
    "col-span-1 md:col-span-2 row-span-1",
    "col-span-2 md:col-span-3 row-span-1",
  ];

  return (
    <section className="bg-white py-8 sm:py-12 lg:py-16 antialiased select-none">
      <Container>
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4 px-1">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-neutral-900">
              Popular Brands
            </h2>
            <p className="text-xs sm:text-sm font-medium text-neutral-500">
              Shop collections directly from world-class partners.
            </p>
          </div>

          <Link
            href="/brands"
            onClick={() => setIsNavigatingAll(true)}
            className={`group relative inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-neutral-900 px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm font-bold tracking-widest uppercase text-white transition-all duration-300 hover:bg-neutral-800 shrink-0 shadow-xs ${
              isNavigatingAll || loadingSlug ? "pointer-events-none opacity-80" : ""
            }`}
          >
            <span>View All</span>
            {isNavigatingAll ? (
              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </Link>
        </div>

        {/* --- MASONRY GRID (2 Cols on Mobile, 12 Cols on Desktop) --- */}
        <div className="grid grid-cols-2 md:grid-cols-12 auto-rows-32.5 sm:auto-rows-37.5 lg:auto-rows-40 gap-2.5 sm:gap-4">
          {displayBrands.map((brand, index) => {
            const spanClass = tileSpans[index] || "col-span-1 md:col-span-2 row-span-1";
            const mobileVisibility = index >= 5 ? "hidden md:block" : "block";
            const isThisLoading = loadingSlug === brand.slug;

            return (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                onClick={() => setLoadingSlug(brand.slug)}
                className={`group relative w-full h-full ${spanClass} ${mobileVisibility} ${
                  loadingSlug || isNavigatingAll ? "pointer-events-none" : ""
                }`}
              >
                <Card
                  className={`relative w-full h-full bg-[#f8f9fa] rounded-xl sm:rounded-2xl border border-neutral-200/80 shadow-none hover:shadow-lg hover:border-neutral-300 transition-all duration-300 overflow-hidden p-3 sm:p-4 flex flex-col justify-between ${
                    isThisLoading ? "opacity-75" : ""
                  }`}
                >
                  {/* CARD LOADING OVERLAY */}
                  {isThisLoading && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                      <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin text-neutral-900 drop-shadow-xs" />
                    </div>
                  )}

                  {/* WATERMARK LOGO */}
                  {brand.logoUrl && (
                    <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-24 h-24 sm:w-40 sm:h-40 opacity-15 group-hover:opacity-25 group-hover:scale-105 transition-all duration-500 pointer-events-none z-0 mix-blend-multiply">
                      <Image
                        src={brand.logoUrl}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        className="object-contain object-right"
                      />
                    </div>
                  )}

                  {/* TOP ACTION ICON */}
                  <div className="relative z-10 flex justify-end">
                    <div className="flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-500 shadow-2xs group-hover:text-neutral-900 group-hover:border-neutral-400 group-hover:rotate-45 transition-all duration-300">
                      <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </div>
                  </div>

                  {/* CENTER LOGO DISPLAY */}
                  <div className="relative z-10 my-auto flex items-center justify-center w-full px-1 sm:px-2">
                    {brand.logoUrl ? (
                      <div className="relative w-full h-10 sm:h-14 max-w-30 sm:max-w-40 mix-blend-multiply transition-transform duration-300 group-hover:scale-105">
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-xs sm:text-base font-black uppercase text-neutral-800 tracking-wider">
                        {brand.name}
                      </span>
                    )}
                  </div>

                  {/* BRAND DESCRIPTION / METADATA */}
                  <div className="relative z-10 pt-1 border-t border-neutral-200/50">
                    <p className="text-[10px] sm:text-[11px] font-medium text-neutral-500 line-clamp-1 group-hover:text-neutral-700 transition-colors">
                      {brand.description || `Official ${brand.name} collection`}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* ELEGANT MOBILE "EXPLORE ALL" CARD */}
          <Link
            href="/brands"
            onClick={() => setIsNavigatingAll(true)}
            className={`block md:hidden col-span-1 row-span-1 group relative w-full h-full ${
              isNavigatingAll || loadingSlug ? "pointer-events-none opacity-80" : ""
            }`}
          >
            <Card className="relative w-full h-full bg-white rounded-xl border border-dashed border-neutral-300 hover:border-neutral-900 transition-colors flex flex-col items-center justify-center p-3 text-center gap-1 shadow-none">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                {isNavigatingAll ? (
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-900" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
              <span className="text-[11px] font-extrabold uppercase tracking-tight text-neutral-800 leading-tight">
                {isNavigatingAll ? "Loading..." : `Explore All (${brands.length})`}
              </span>
            </Card>
          </Link>
        </div>
      </Container>
    </section>
  );
}