"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Category } from "@africasuk/types";

interface MobileCategoriesProps {
  categories: Category[];
}

export default function MobileCategories({
  categories = [],
}: MobileCategoriesProps) {
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const visibleCategories = categories.slice(0, 12);

  if (visibleCategories.length === 0) return null;

  const firstRow = visibleCategories.filter((_, index) => index % 2 === 0);
  const secondRow = visibleCategories.filter((_, index) => index % 2 !== 0);

  const renderCategory = (category: Category) => {
    const isLoading = loadingSlug === category.slug;

    return (
      <Link
        key={category.id}
        href={`/categories/${category.slug}`}
        onClick={() => setLoadingSlug(category.slug)}
        aria-label={`Shop ${category.name}`}
        className="flex w-15.25 shrink-0 flex-col items-center gap-2 text-center"
      >
        <div className="relative flex h-13.5 w-13.5 items-center justify-center overflow-hidden rounded-full border border-[#F0F0EB] bg-[#F4F4F1]">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              sizes="54px"
              className="object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-[#005c2e]">
              {category.name.charAt(0).toUpperCase()}
            </span>
          )}

          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </span>
          )}
        </div>

        <span className="w-full truncate text-[11px] font-medium leading-tight text-gray-800">
          {category.name}
        </span>
      </Link>
    );
  };

  return (
    <section className="w-full overflow-hidden border-b border-gray-100 bg-white py-2.5 pb-3.5 antialiased lg:hidden">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-base font-bold tracking-tight text-gray-900">
          Categories
        </h2>

        <Link
          href="/categories"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#005c2e]"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-3.5">
        <div className="flex gap-3.75 overflow-x-auto px-4 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {firstRow.map(renderCategory)}
        </div>

        {secondRow.length > 0 && (
          <div className="flex gap-3.75 overflow-x-auto px-4 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {secondRow.map(renderCategory)}
          </div>
        )}
      </div>
    </section>
  );
}