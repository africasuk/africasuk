"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";

import type { Category } from "@africasuk/types";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

interface Props {
  categories: Category[];
}

export default function Categories({ categories = [] }: Props) {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [isNavigatingAll, setIsNavigatingAll] = useState(false);

  if (categories.length === 0) return null;

  const visibleCategories = categories.slice(0, 6);

  // Asymmetrical Bento Layout Classes
  const getBentoClasses = (index: number) => {
    switch (index) {
      case 0:
        // Large Featured Card (2x2 on desktop)
        return "col-span-2 md:col-span-2 md:row-span-2 h-52 sm:h-64 md:h-full min-h-[220px] md:min-h-[340px]";
      case 1:
        // Wide Card
        return "col-span-1 md:col-span-2 h-36 sm:h-44 md:h-40";
      case 2:
        // Compact Square Card
        return "col-span-1 md:col-span-1 h-36 sm:h-44 md:h-40";
      case 3:
        // Compact Square Card
        return "col-span-1 md:col-span-1 h-36 sm:h-44 md:h-40";
      case 4:
        // Wide Card
        return "col-span-1 md:col-span-2 h-36 sm:h-44 md:h-44";
      case 5:
        // Wide Card (Full-width on mobile to close the row cleanly)
        return "col-span-2 md:col-span-2 h-36 sm:h-44 md:h-44";
      default:
        return "col-span-1 h-36 md:h-40";
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white antialiased select-none border-b border-gray-100">
      <Container>
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
              Shop by Category
            </h2>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Explore departments
            </p>
          </div>

          <Link
            href="/categories"
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

        {/* Dynamic Bento Grid with Varied Card Sizes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
          {visibleCategories.map((category, index) => {
            const isThisLoading = loadingSlug === category.slug;
            const isPrimary = index === 0;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setLoadingSlug(category.slug)}
                className={`group relative block w-full overflow-hidden bg-gray-50 border border-gray-200 transition-colors hover:border-gray-400 ${getBentoClasses(
                  index
                )} ${loadingSlug || isNavigatingAll ? "pointer-events-none" : ""}`}
              >
                {/* Loading State */}
                {isThisLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-xs">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}

                {/* Category Image */}
                {category.imageUrl ? (
                  <Image
                    src={category.imageUrl}
                    alt={category.name}
                    fill
                    sizes={
                      isPrimary
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                    }
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}

                {/* Clean Legibility Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

                {/* Minimal Label */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3.5 z-10">
                  <span
                    className={`block font-semibold text-white truncate ${
                      isPrimary
                        ? "text-sm sm:text-base md:text-lg"
                        : "text-[11px] sm:text-xs md:text-sm"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom All Categories Button */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="rounded-none border-gray-300 text-xs font-semibold text-gray-800 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer h-9 px-6 flex items-center justify-center gap-1.5 shadow-none transition-colors"
          >
            <Link
              href="/categories"
              onClick={() => setIsNavigatingAll(true)}
              className={isNavigatingAll ? "pointer-events-none opacity-60" : ""}
            >
              <span>View All Categories</span>
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