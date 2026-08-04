"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import type { Category } from "@africasuk/types";

import Container from "@/components/layout/Container";
import { Card } from "@/components/ui/card";

interface Props {
  categories: (Category & { description?: string })[];
}

export default function Categories({ categories = [] }: Props) {
  const [isExpanded] = useState(false);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [isNavigatingAll, setIsNavigatingAll] = useState(false);

  // Show only 6 categories initially, or all if expanded
  const visibleCategories = isExpanded ? categories : categories.slice(0, 6);

  // Helper function to dynamically style the Bento layout based on index
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
              Shop by Category
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600 font-medium max-w-md">
              Discover verified premium brands across our curated departments.
            </p>
          </div>

          <Link
            href="/categories"
            onClick={() => setIsNavigatingAll(true)}
            className={`group relative inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-[#005c2e] transition-colors hover:text-[#002b15] shrink-0 pb-1 ${
              isNavigatingAll || loadingSlug ? "pointer-events-none opacity-80" : ""
            }`}
          >
            <span>View All</span>
            {isNavigatingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-[#002b15] to-[#005c2e] transition-all duration-300 group-hover:w-full" />
            )}
          </Link>
        </div>

        {/* Responsive Bento Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 md:grid-rows-[repeat(3,260px)] gap-3 sm:gap-6">
          {visibleCategories.map((category, index) => {
            const isThisLoading = loadingSlug === category.slug;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setLoadingSlug(category.slug)}
                className={`group relative block w-full transition-transform duration-500 ease-out hover:-translate-y-1 ${getBentoClasses(
                  index
                )} ${loadingSlug || isNavigatingAll ? "pointer-events-none" : ""}`}
              >
                <Card className="relative w-full h-full bg-gray-100 rounded-2xl sm:rounded-3xl border border-gray-200/60 shadow-2xs hover:shadow-xl hover:shadow-black/10 transition-all duration-500 overflow-hidden select-none">
                  {/* CARD LOADING OVERLAY */}
                  {isThisLoading && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                      <Loader2 className="h-7 w-7 sm:h-8 sm:w-8 animate-spin text-white drop-shadow-md" />
                    </div>
                  )}

                  {/* Full-bleed background image - completely clear */}
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 450px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}

                  {/* Minimal bottom gradient overlay - keeps the image 80% untouched */}
                  <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Bottom-aligned Typography Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-3.5 sm:p-5 md:p-6 z-10 flex flex-col justify-end">
                    <h3 className="text-sm sm:text-xl md:text-2xl font-black tracking-tight text-white leading-tight sm:leading-snug transition-colors line-clamp-1 uppercase drop-shadow-xs">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-[10px] sm:text-xs md:text-sm text-gray-200 font-medium leading-normal sm:leading-relaxed max-w-sm line-clamp-2 md:line-clamp-2 drop-shadow-xs">
                      {category.description ||
                        `Explore our high-quality handpicked collection in ${category.name.toLowerCase()}.`}
                    </p>
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