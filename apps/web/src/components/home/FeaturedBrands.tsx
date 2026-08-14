"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import type { Brand } from "@africasuk/types";

import Container from "@/components/layout/Container";
import { Card } from "@/components/ui/card";
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
    <section className="py-8 sm:py-12 bg-white antialiased select-none border-b border-gray-100">
      <Container className="max-w-none w-full px-3 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-4 sm:mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
              Featured Brands
            </h2>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Official collections from verified global partners
            </p>
          </div>

          <Link
            href="/brands"
            onClick={() => setIsNavigatingAll(true)}
            className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#004d26] hover:text-[#00361a] transition-colors ${
              isNavigatingAll || loadingSlug ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <span>View all</span>
            {isNavigatingAll ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5" />
            )}
          </Link>
        </div>

        {/* Minimal Clean Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
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
                  className={`relative h-20 sm:h-24 md:h-28 w-full rounded-none border border-gray-200 bg-gray-50/60 p-3 flex flex-col items-center justify-center transition-colors duration-200 hover:bg-white hover:border-gray-400 shadow-none ${
                    isThisLoading ? "opacity-70" : ""
                  }`}
                >
                  {/* Loading Spinner */}
                  {isThisLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-none bg-white/80 backdrop-blur-xs">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-[#004d26]" />
                    </div>
                  )}

                  {/* Brand Logo or Fallback Name */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    {brand.logoUrl ? (
                      <div className="relative w-full h-8 sm:h-10 max-w-24 sm:max-w-28 transition-transform duration-300 group-hover:scale-103">
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          fill
                          sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 160px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center line-clamp-1">
                        {brand.name}
                      </span>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Bottom All Brands Button */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="rounded-none border-gray-300 text-xs font-semibold text-gray-800 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer h-9 px-6 flex items-center justify-center gap-1.5 shadow-none transition-colors"
          >
            <Link
              href="/brands"
              onClick={() => setIsNavigatingAll(true)}
              className={isNavigatingAll ? "pointer-events-none opacity-60" : ""}
            >
              <span>View All Brands</span>
              {isNavigatingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin ml-1" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
              )}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}