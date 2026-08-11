"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
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

  // Display top brands (increased slice limit to seamlessly fill wide rows)
  const displayBrands = brands.slice(0, 18);

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-gray-100 select-none">
      {/* Container override for edge-to-edge layout on large screens */}
      <Container className="max-w-none w-full px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Featured Brands
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Discover official collections from our trusted global partners.
            </p>
          </div>

          <Link
            href="/brands"
            onClick={() => setIsNavigatingAll(true)}
            className={`group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#005c2e] hover:text-[#002b15] transition-colors ${
              isNavigatingAll || loadingSlug ? "pointer-events-none opacity-70" : ""
            }`}
          >
            <span>View All Brands</span>
            {isNavigatingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </Link>
        </div>

        {/* --- Brand Grid --- */}
        {/* Responsive auto-fit grid maintains ideal card dimensions while expanding across widescreen */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {displayBrands.map((brand) => {
            const isThisLoading = loadingSlug === brand.slug;

            return (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                onClick={() => setLoadingSlug(brand.slug)}
                className={`group relative w-full ${
                  loadingSlug || isNavigatingAll ? "pointer-events-none" : ""
                }`}
              >
                <Card
                  className={`relative h-28 sm:h-32 w-full rounded-2xl border border-gray-100 bg-gray-50/50 p-4 flex flex-col items-center justify-center transition-all duration-300 hover:bg-white hover:border-[#005c2e]/30 hover:shadow-md ${
                    isThisLoading ? "opacity-70" : ""
                  }`}
                >
                  {/* Loading Spinner */}
                  {isThisLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-[1px]">
                      <Loader2 className="h-5 w-5 animate-spin text-[#005c2e]" />
                    </div>
                  )}

                  {/* Brand Logo or Fallback Name */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {brand.logoUrl ? (
                      <div className="relative w-full h-12 max-w-30 transition-transform duration-300 group-hover:scale-105">
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          fill
                          sizes="(max-width: 640px) 40vw, 20vw"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-gray-800 text-center line-clamp-1">
                        {brand.name}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}