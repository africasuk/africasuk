"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Brand } from "@africasuk/types";

import Container from "@/components/layout/Container";
import { Card } from "@/components/ui/card";

interface Props {
  brands: (Brand & { description?: string })[];
}

export default function FeaturedBrands({ brands = [] }: Props) {
  const [isExpanded] = useState(false);

  if (brands.length === 0) return null;

  // Show only 6 brands initially on bento style
  const visibleBrands = isExpanded ? brands : brands.slice(0, 6);

  // Helper function to dynamically style the Bento layout on desktop
  const getBentoClasses = (index: number) => {
    switch (index) {
      case 0:
        return "col-span-1 md:col-span-1 md:row-span-2 h-48 sm:h-64 md:h-auto";
      case 1:
        return "col-span-1 md:col-span-2 h-48 sm:h-64 md:h-auto";
      case 2:
        return "col-span-1 md:col-span-1 h-48 sm:h-64 md:h-auto";
      case 3:
        return "col-span-1 md:col-span-1 h-48 sm:h-64 md:h-auto";
      case 4:
        return "col-span-1 md:col-span-2 h-48 sm:h-64 md:h-auto";
      case 5:
        return "col-span-1 md:col-span-1 h-48 sm:h-64 md:h-auto";
      default:
        return "col-span-1 md:col-span-1 h-48 sm:h-64 md:h-auto";
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-gray-50/50 antialiased select-none border-y border-gray-100">
      <Container>
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between gap-4 px-2 select-none">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl uppercase">
              Popular Brands
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600 font-medium max-w-md">
              Shop official collections from certified international global partners.
            </p>
          </div>

          <Link
            href="/brands"
            className="group relative text-xs sm:text-sm font-bold tracking-wider uppercase text-[#005c2e] transition-colors hover:text-[#002b15] shrink-0 pb-1"
          >
            View All
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-[#002b15] to-[#005c2e] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* Responsive Layout: 2 cols on mobile, 3-column dynamic Bento on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-[repeat(3,260px)] gap-3 sm:gap-6">
          {visibleBrands.map((brand, index) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className={`group relative block w-full transition-transform duration-500 ease-out hover:-translate-y-1 ${getBentoClasses(
                index
              )}`}
            >
              {/* Desktop Style: Clean white backdrop with crisp logo display */}
              <Card className="hidden md:flex relative w-full h-full bg-white rounded-3xl border border-gray-200/60 shadow-2xs hover:shadow-xl hover:shadow-[#002b15]/10 transition-all duration-500 overflow-hidden select-none">
                
                {/* Watermark Logo Accent */}
                {brand.logoUrl && (
                  <div className="absolute -right-6 -bottom-6 w-36 h-36 sm:w-44 sm:h-44 opacity-5 pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-6 z-0">
                    <Image
                      src={brand.logoUrl}
                      alt=""
                      fill
                      className="object-contain filter grayscale"
                      sizes="(max-width: 1024px) 144px, 176px"
                    />
                  </div>
                )}

                {/* Logo showcase container */}
                <div className="absolute inset-0 flex items-center justify-center p-12 pb-24 z-10">
                  {brand.logoUrl ? (
                    <div className="relative w-full h-full max-h-32 transition-transform duration-700 ease-out group-hover:scale-105">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 1024px) 33vw, 450px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-5xl font-black text-[#002b15]/15">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Soft gradient bottom tint to ensure legible text without obscuring the card */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-gray-950/80 via-gray-950/20 to-transparent pointer-events-none z-10" />

                {/* Bottom-aligned Typography */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-20 flex flex-col justify-end">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight text-white leading-snug uppercase transition-colors line-clamp-1 drop-shadow-xs">
                    {brand.name}
                  </h3>
                  <p className="mt-1 text-xs md:text-sm text-gray-200 font-medium leading-relaxed max-w-sm line-clamp-2 drop-shadow-xs">
                    {brand.description || `Discover authentic products from the official ${brand.name} catalog.`}
                  </p>
                </div>
              </Card>

              {/* Mobile Style: Compact Minimalist Cards */}
              <Card className="flex md:hidden relative w-full h-full bg-white rounded-2xl border border-gray-200/60 shadow-2xs hover:shadow-lg transition-all duration-500 overflow-hidden flex-col justify-between p-4 select-none">
                
                {/* Mobile Watermark */}
                {brand.logoUrl && (
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-110 z-0">
                    <Image
                      src={brand.logoUrl}
                      alt=""
                      fill
                      className="object-contain filter grayscale"
                      sizes="96px"
                    />
                  </div>
                )}

                {/* Text Content */}
                <div className="z-10 max-w-37.5">
                  <h3 className="text-sm font-black tracking-tight text-gray-900 group-hover:text-[#005c2e] transition-colors duration-300 leading-snug line-clamp-1 uppercase">
                    {brand.name}
                  </h3>
                  <p className="mt-1 text-[10px] text-gray-500 leading-normal font-medium line-clamp-2">
                    {brand.description || `Shop ${brand.name}.`}
                  </p>
                </div>

                {/* Compact Logo Badge */}
                <div className="relative mt-2 self-end w-12 h-12 z-10">
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-emerald-50 flex items-center justify-center text-sm font-black text-[#005c2e]">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}