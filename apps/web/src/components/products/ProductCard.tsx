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

  // Determine selected color or fallback to first option
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
      className={`group flex flex-col w-full text-left select-none antialiased transition-all duration-300 focus:outline-none ${
        isLoading ? "pointer-events-none opacity-80" : ""
      }`}
    >
      {/* 1. Pinterest-Style 1:1 Image Frame */}
      <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100/80 transition-transform duration-300 ease-out group-hover:scale-[1.02]">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={80}
          className="object-cover"
        />

        {/* Loading Spinner Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-xs">
            <Loader2 className="h-6 w-6 animate-spin text-[#008744]" />
          </div>
        )}

        {/* Minimal Rounded Floating Color Swatches */}
        {product.colors.length > 1 && !isLoading && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-xs px-2 py-1 shadow-xs border border-gray-100">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.id}
                className={`h-2.5 w-2.5 rounded-full border border-black/10 transition-transform ${
                  c.id === color?.id ? "ring-1 ring-[#008744] scale-110" : ""
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

      {/* 2. Metadata Below Image */}
      <div className="flex flex-col pt-3 px-1 space-y-1">
        {product.brand?.name && (
          <p className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 truncate">
            {product.brand.name}
          </p>
        )}

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[#008744] transition-colors">
          {product.name}
        </h3>

        {/* Rating Line */}
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

          <span className="text-[10px] font-medium text-gray-500">
            {reviewCount > 0
              ? `${averageRating.toFixed(1)} (${reviewCount})`
              : "No reviews"}
          </span>
        </div>

        {/* 3. Price */}
        <div className="pt-0.5 text-sm font-bold text-gray-900 tracking-tight">
          <Price price={Number(basePrice)} />
        </div>
      </div>
    </Link>
  );
}