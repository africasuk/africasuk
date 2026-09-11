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
    <section className="w-full border-b border-gray-100 bg-white py-8 antialiased select-none sm:py-12">
      <Container className="w-full max-w-none px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-100 pb-4 sm:mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Popular Brands
            </h2>

            <p className="mt-0.5 text-xs font-normal text-gray-500 sm:text-sm">
              Explore products from popular brands available on Africa Suk.
            </p>
          </div>

          <Link
            href="/brands"
            onClick={() => setIsNavigatingAll(true)}
            className={`hidden items-center gap-1.5 text-xs font-semibold text-[#008744] transition-all hover:underline sm:inline-flex ${
              isNavigatingAll || loadingSlug
                ? "pointer-events-none opacity-60"
                : ""
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

        {/* Brand Tiles */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9">
          {displayBrands.map((brand) => {
            const isThisLoading = loadingSlug === brand.slug;

            return (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                onClick={() => setLoadingSlug(brand.slug)}
                className={`group flex w-full flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 focus:outline-none ${
                  loadingSlug || isNavigatingAll
                    ? "pointer-events-none"
                    : ""
                }`}
              >
                {/* Brand Image */}
                <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl border border-gray-100 bg-white p-1.5 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-xs sm:p-2">
                  {/* Loading Overlay */}
                  {isThisLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-xs">
                      <Loader2 className="h-5 w-5 animate-spin text-[#008744]" />
                    </div>
                  )}

                  {brand.logoUrl ? (
                    <div className="relative h-full w-full overflow-hidden rounded-xl">
                      <Image
                        src={brand.logoUrl}
                        alt={`${brand.name} products on Africa Suk`}
                        fill
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 15vw, 160px"
                        className="rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700 sm:text-sm">
                      {brand.name.slice(0, 3)}
                    </span>
                  )}
                </div>

                {/* Brand Name */}
                <span className="mt-1.5 w-full line-clamp-1 text-[11px] font-semibold tracking-tight text-gray-700 transition-colors group-hover:text-[#008744] sm:text-xs">
                  {brand.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Action */}
        <div className="mt-8 flex justify-center sm:mt-10">
          <Button
            asChild
            variant="outline"
            className="h-10 cursor-pointer gap-2 rounded-full border-gray-200 bg-white px-7 text-xs font-semibold text-gray-800 shadow-xs transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-[#008744] active:scale-95"
          >
            <Link
              href="/brands"
              onClick={() => setIsNavigatingAll(true)}
              className={isNavigatingAll ? "pointer-events-none opacity-60" : ""}
            >
              <span>Explore All Brands</span>

              {isNavigatingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}