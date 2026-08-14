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

  // Determine selected color or default to the first color option
  const color =
    product.colors.find((c) => c.id === product.selectedColorId) ??
    product.colors[0];

  const image = color?.images?.[0]?.imageUrl ?? "/placeholder.png";

  // Safely extract base price from active color or fallback variants
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
      className={`group relative flex flex-col rounded-none border border-gray-200 bg-white p-2.5 sm:p-3 transition-colors duration-200 hover:border-gray-400 select-none antialiased shadow-none ${
        isLoading ? "pointer-events-none opacity-80" : ""
      }`}
    >
      {/* 1. Image Showcase Frame */}
      <div className="relative aspect-square w-full overflow-hidden rounded-none bg-gray-50 border border-gray-100">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
        />

        {/* Loading Spinner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-xs">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-[#004d26]" />
          </div>
        )}

        {/* Minimal Color Swatches */}
        {product.colors.length > 1 && !isLoading && (
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-none bg-white/95 px-1.5 py-0.5 border border-gray-200">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.id}
                className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-none border border-black/10 ${
                  c.id === color?.id ? "ring-1 ring-[#004d26]" : ""
                }`}
                style={{
                  backgroundColor: c.hexCode ?? c.name.toLowerCase(),
                }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[9px] font-semibold text-gray-500 pl-0.5">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Content & Metadata */}
      <div className="flex flex-col justify-between grow pt-2.5 space-y-2">
        <div className="space-y-1">
          {product.brand?.name && (
            <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-gray-400 truncate">
              {product.brand.name}
            </p>
          )}

          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#004d26] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating Display */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg
                  key={index}
                  viewBox="0 0 20 20"
                  className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
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
              <span className="text-[10px] font-medium text-gray-500">
                {averageRating.toFixed(1)} ({reviewCount})
              </span>
            ) : (
              <span className="text-[10px] font-medium text-gray-400">
                No reviews
              </span>
            )}
          </div>
        </div>

        {/* 3. Price Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-gray-100">
          <div className="text-xs sm:text-sm font-bold text-[#004d26] tracking-tight">
            <Price price={Number(basePrice)} />
          </div>

          <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-[#004d26] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            {isLoading ? "Loading..." : "View →"}
          </span>
        </div>
      </div>
    </Link>
  );
}