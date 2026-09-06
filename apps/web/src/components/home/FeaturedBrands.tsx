"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import type { Brand } from "@africasuk/types";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

interface Props {
  brands: (Brand & {
    description?: string;
  })[];
}

export default function FeaturedBrands({ brands = [] }: Props) {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [isNavigatingAll, setIsNavigatingAll] = useState(false);

  if (brands.length === 0) return null;

  // Display top brands
  const displayBrands = brands.slice(0, 18);

  return (
    <section className="w-full py-8 sm:py-12 bg-white antialiased select-none border-b border-gray-100">
      <Container className="max-w-none w-full px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 flex items-end justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Featured Brands
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              Official collections from verified global partners
            </p>
          </div>

          <Link
            href="/brands"
            onClick={() => setIsNavigatingAll(true)}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#008744] hover:underline transition-all ${
              isNavigatingAll || loadingSlug ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <span>View all brands</span>
            {isNavigatingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5" />
            )}
          </Link>
        </div>

        {/* Tight Pinterest Brand Tiles */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-3 sm:gap-4">
          {displayBrands.map((brand) => {
            const isThisLoading = loadingSlug === brand.slug;

            return (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                onClick={() => setLoadingSlug(brand.slug)}
                className={`group flex flex-col items-center text-center w-full focus:outline-none transition-transform duration-300 hover:-translate-y-1 ${
                  loadingSlug || isNavigatingAll ? "pointer-events-none" : ""
                }`}
              >
                {/* 1:1 Clean Image Frame with Rounded Inner Image */}
                <div className="relative aspect-square w-full rounded-2xl bg-white border border-gray-100 p-1.5 sm:p-2 flex items-center justify-center transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-xs">
                  {/* Loading Spinner Overlay */}
                  {isThisLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-xs">
                      <Loader2 className="h-5 w-5 animate-spin text-[#008744]" />
                    </div>
                  )}

                  {/* Rounded Sharp Logo Presentation */}
                  {brand.logoUrl ? (
                    <div className="relative w-full h-full overflow-hidden rounded-xl">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 15vw, 160px"
                        className="object-contain rounded-xl transition-transform duration-300 group-hover:scale-105"
                        style={{
                          imageRendering: "-webkit-optimize-contrast",
                        }}
                      />
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                      {brand.name.slice(0, 3)}
                    </span>
                  )}
                </div>

                {/* Brand Name Underneath */}
                <span className="mt-1.5 text-[11px] sm:text-xs font-semibold text-gray-700 tracking-tight line-clamp-1 w-full group-hover:text-[#008744] transition-colors">
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Action Button */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-gray-200 text-xs font-semibold text-gray-800 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-[#008744] cursor-pointer h-10 px-7 flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Link
              href="/brands"
              onClick={() => setIsNavigatingAll(true)}
              className={isNavigatingAll ? "pointer-events-none opacity-60" : ""}
            >
              <span>Explore All Verified Brands</span>
              {isNavigatingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}