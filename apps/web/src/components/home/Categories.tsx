"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";

import type { Category } from "@africasuk/types";

import Container from "@/components/layout/Container";
import { Card } from "@/components/ui/card";

interface Props {
  categories: (Category & { description?: string })[];
}

export default function Categories({ categories = [] }: Props) {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [isNavigatingAll, setIsNavigatingAll] = useState(false);

  if (categories.length === 0) return null;

  // Show 6 categories for the bento layout
  const visibleCategories = categories.slice(0, 6);

  // Dynamic Bento Grid Spans for 6 Items
  const getBentoClasses = (index: number) => {
    switch (index) {
      case 0:
        return "col-span-2 md:col-span-1 md:row-span-2 h-64 md:h-auto"; // Tall Card
      case 1:
        return "col-span-2 md:col-span-2 md:row-span-1 h-52 md:h-auto"; // Wide Card
      case 2:
        return "col-span-1 md:col-span-1 md:row-span-1 h-48 md:h-auto";
      case 3:
        return "col-span-1 md:col-span-1 md:row-span-1 h-48 md:h-auto";
      case 4:
        return "col-span-2 md:col-span-2 md:row-span-1 h-52 md:h-auto"; // Wide Card
      case 5:
        return "col-span-2 md:col-span-1 md:row-span-1 h-48 md:h-auto";
      default:
        return "col-span-1 md:col-span-1 h-48 md:h-auto";
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white antialiased select-none border-y border-gray-100">
      <Container>
        {/* Section Header */}
        <div className="mb-8 flex items-end justify-between gap-4 select-none">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-md">
              Discover curated departments and find exactly what you need.
            </p>
          </div>

          <Link
            href="/categories"
            onClick={() => setIsNavigatingAll(true)}
            className={`group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#005c2e] hover:text-[#002b15] transition-colors shrink-0 ${
              isNavigatingAll || loadingSlug ? "pointer-events-none opacity-70" : ""
            }`}
          >
            <span>View All Categories</span>
            {isNavigatingAll ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </Link>
        </div>

        {/* Dynamic Bento Grid Layout (Uses auto-rows so all 3 rows render cleanly) */}
        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-50 sm:auto-rows-60 md:auto-rows-65 gap-3 sm:gap-5">
          {visibleCategories.map((category, index) => {
            const isThisLoading = loadingSlug === category.slug;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setLoadingSlug(category.slug)}
                className={`group relative block w-full transition-all duration-300 ${getBentoClasses(
                  index
                )} ${loadingSlug || isNavigatingAll ? "pointer-events-none" : ""}`}
              >
                <Card className="relative w-full h-full bg-gray-100 rounded-none border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden select-none">
                  {/* CARD LOADING OVERLAY */}
                  {isThisLoading && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                      <Loader2 className="h-6 w-6 animate-spin text-white drop-shadow-md" />
                    </div>
                  )}

                  {/* Full-bleed background image */}
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 450px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100" />
                  )}

                  {/* Elegant bottom gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                  {/* Bottom-aligned Typography Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 z-10 flex flex-col justify-end space-y-1">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white transition-colors line-clamp-1">
                      {category.name}
                    </h3>

                    <p className="text-xs text-gray-200 font-normal line-clamp-2 max-w-sm opacity-90">
                      {category.description ||
                        `Explore our collection in ${category.name.toLowerCase()}.`}
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