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

        {/* Pinterest-style 1:1 Aspect Ratio Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {visibleCategories.map((category, index) => {
            const isThisLoading = loadingSlug === category.slug;
            const isPrimary = index === 0;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setLoadingSlug(category.slug)}
                className={`group relative flex flex-col w-full overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 shadow-xs transition-all duration-300 hover:shadow-md hover:border-gray-200 ${
                  loadingSlug || isNavigatingAll ? "pointer-events-none" : ""
                }`}
              >
                {/* Loading State */}
                {isThisLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-xs">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}

                {/* 1:1 Square Image Container */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      quality={80}
                      priority={isPrimary}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}

                  {/* Subtle hover overlay for Pinterest visual depth */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Clean Label Below 1:1 Image */}
                <div className="p-3 text-center bg-white">
                  <span className="block font-medium text-gray-900 text-xs sm:text-sm truncate group-hover:text-[#004d26] transition-colors">
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
            className="rounded-full border-gray-300 text-xs font-semibold text-gray-800 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer h-9 px-6 flex items-center justify-center gap-1.5 shadow-none transition-colors"
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