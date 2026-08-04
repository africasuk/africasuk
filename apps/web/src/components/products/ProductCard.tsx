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

  return (
    <Link
      href={`/products/${product.slug}${color?.id ? `?color=${color.id}` : ""}`}
      onClick={() => setIsLoading(true)}
      className={`group relative flex flex-col rounded-xl sm:rounded-2xl border border-gray-100 bg-white p-2 sm:p-3 transition-all duration-300 hover:border-[#002b15]/20 hover:shadow-lg ${
        isLoading ? "pointer-events-none opacity-80" : ""
      }`}
    >
      {/* 1. Image Showcase Frame: Scaled height for mobile */}
      <div className="relative h-36 sm:h-48 md:h-64 w-full overflow-hidden rounded-lg sm:rounded-xl bg-gray-50">
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

        {/* Minimalist Color Swatch Preview Pill: Compact size on mobile */}
        {product.colors.length > 1 && !isLoading && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 flex items-center gap-0.5 sm:gap-1 rounded-full bg-white/90 backdrop-blur-xs px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-2xs border border-gray-100">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.id}
                className={`h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full border border-black/10 ${
                  c.id === color?.id ? "ring-1 ring-[#002b15]" : ""
                }`}
                style={{
                  backgroundColor: c.hexCode ?? c.name.toLowerCase(),
                }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 pl-0.5">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Content & Metadata Section */}
      <div className="flex flex-col justify-between grow pt-2 sm:pt-3.5 px-0.5 sm:px-1 space-y-1 sm:space-y-2">
        <div className="space-y-0.5 sm:space-y-1">
          {product.brand?.name && (
            <p className="text-[8px] sm:text-[10px] font-bold tracking-widest uppercase text-gray-400">
              {product.brand.name}
            </p>
          )}

          <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#005c2e] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>

        {/* 3. Price Display */}
        <div className="pt-0.5 sm:pt-1 flex items-baseline justify-between">
          <div className="text-xs sm:text-base font-black text-[#002b15] tracking-tight">
            <Price price={Number(basePrice)} />
          </div>

          <span className="hidden sm:inline-block text-[11px] font-semibold text-[#005c2e] opacity-0 group-hover:opacity-100 transition-opacity">
            {isLoading ? "Loading..." : "View Item →"}
          </span>
        </div>
      </div>
    </Link>
  );
}