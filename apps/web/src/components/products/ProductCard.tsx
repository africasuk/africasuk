"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "@/components/currency/Price";

interface Props {
  product: ProductWithDetails & {
    selectedColorId?: string;
  };
}

export function ProductCard({ product }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  // Determine selected color or default to first color option
  const color =
    product.colors.find((c) => c.id === product.selectedColorId) ??
    product.colors[0];

  const image = color?.images?.[0]?.imageUrl ?? "/placeholder.png";

  // Safely extract price from the active color's variants or fall back across colors
  const basePrice =
    color?.variants?.[0]?.price ??
    product.colors.flatMap((c) => c.variants ?? [])[0]?.price ??
    0;

  const averageRating = product.rating?.averageRating ?? 0;
  const reviewCount = product.rating?.reviewCount ?? 0;

  return (
    <Link
      href={`/products/${product.slug}${color?.id ? `?color=${color.id}` : ""}`}
      onClick={() => setIsLoading(true)}
      className={`group relative flex flex-col rounded-xl sm:rounded-2xl border border-gray-100/80 bg-white p-2.5 sm:p-3.5 transition-all duration-300 hover:border-[#002b15]/20 hover:shadow-xl hover:shadow-gray-900/5 ${
        isLoading ? "pointer-events-none opacity-80" : ""
      }`}
    >
      {/* 1. Image Showcase Frame */}
      <div className="relative h-36 sm:h-48 md:h-60 w-full overflow-hidden rounded-lg sm:rounded-xl bg-gray-50/80">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Loading Spinner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-white drop-shadow-md" />
          </div>
        )}

        {/* Color Swatch Preview Pill */}
        {product.colors.length > 1 && !isLoading && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-xs px-2 py-1 shadow-xs border border-gray-100">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.id}
                className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full border border-black/10 ${
                  c.id === color?.id ? "ring-1 ring-[#002b15]" : ""
                }`}
                style={{
                  backgroundColor: c.hexCode ?? c.name.toLowerCase(),
                }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[9px] font-bold text-gray-400 pl-0.5">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Content & Metadata Section */}
      <div className="flex flex-col justify-between grow pt-3 px-0.5 space-y-2">
        <div className="space-y-1">
          {product.brand?.name && (
            <p className="text-[9px] sm:text-[10px] font-extrabold tracking-widest uppercase text-gray-400">
              {product.brand.name}
            </p>
          )}

          <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#005c2e] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating Display */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  viewBox="0 0 20 20"
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${
                    index < Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.35 1.107l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.35-1.107L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {reviewCount > 0 ? (
              <span className="text-[10px] sm:text-xs font-semibold text-gray-500">
                {averageRating.toFixed(1)} ({reviewCount})
              </span>
            ) : (
              <span className="text-[10px] sm:text-xs font-medium text-gray-400">
                No reviews
              </span>
            )}
          </div>
        </div>

        {/* 3. Price Display */}
        <div className="pt-2 flex items-center justify-between border-t border-gray-100/60">
          <div className="text-sm sm:text-base font-black text-[#002b15] tracking-tight">
            <Price price={Number(basePrice)} />
          </div>

          <span className="hidden sm:inline-flex items-center text-[11px] font-extrabold text-[#005c2e] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            {isLoading ? "Loading..." : "View Item →"}
          </span>
        </div>
      </div>
    </Link>
  );
}