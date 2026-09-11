"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import type { ProductWithDetails } from "@africasuk/types";

import type { CartItem } from "@/types/cart";
import { Price } from "@/components/currency/Price";
import { AddToCartButton } from "./AddToCartButton";
import { WishlistButton } from "./WishlistButton";

type ColorWithDetails = ProductWithDetails["colors"][number];

interface Props {
  product: ProductWithDetails;
  onColorChange?: (color: ColorWithDetails) => void;
}

export function VariantSelector({ product, onColorChange }: Props) {
  const [selectedColor, setSelectedColor] = useState<ColorWithDetails>(
    product.colors[0]
  );

  const [selectedVariant, setSelectedVariant] = useState(
    product.colors[0]?.variants[0]
  );

  const updateSelectedColor = (color: ColorWithDetails) => {
    setSelectedColor(color);
    if (onColorChange) {
      onColorChange(color);
    }

    // Automatically pick the first in-stock variant of this color, or fall back to the first variant
    const inStockVariant =
      color.variants.find((v) => (v.stock ?? 0) > 0) ?? color.variants[0];
    setSelectedVariant(inStockVariant);
  };

  // Only sizes that actually belong to the currently selected color
  const colorSizes = useMemo(() => {
    return selectedColor?.variants ?? [];
  }, [selectedColor]);

  if (!selectedColor || !selectedVariant) {
    return null;
  }

  const item: CartItem = {
    variantId: selectedVariant.id,
    productId: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(selectedVariant.price),
    stock: selectedVariant.stock,
    allowCod: product.allowCod,
    allowOnlinePayment: product.allowOnlinePayment,
    image: selectedColor.images[0]?.imageUrl ?? "/placeholder.png",
    options: [
      {
        optionName: "Color",
        value: selectedColor.name,
      },
      {
        optionName: selectedVariant.optionName || "Size",
        value: selectedVariant.optionValue,
      },
    ],
    quantity: 1,
  };

  return (
    <div className="space-y-6 select-none antialiased">
      {/* 1. COLOR SELECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-zinc-500">
            Color
          </span>
          <span className="font-semibold text-zinc-900 capitalize">
            {selectedColor.name}
          </span>
        </div>

        {/* Color Thumbnail Cards */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {product.colors.map((color) => {
            const isSelected = selectedColor.id === color.id;
            const primaryImage = color.images[0]?.imageUrl;
            const totalStock = color.variants.reduce(
              (acc, v) => acc + (v.stock || 0),
              0
            );
            const isSoldOut = totalStock <= 0;

            return (
              <button
                key={color.id}
                type="button"
                aria-label={`Select ${color.name}`}
                aria-pressed={isSelected}
                disabled={isSoldOut}
                onClick={() => updateSelectedColor(color)}
                className={`group relative flex flex-col rounded-xl border p-1 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-50 shadow-sm ring-1 ring-zinc-900"
                    : isSoldOut
                    ? "border-zinc-200/60 bg-zinc-50/50 opacity-40 cursor-not-allowed"
                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/60"
                }`}
              >
                {/* Image Aspect Box */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100">
                  {primaryImage ? (
                    <Image
                      src={primaryImage}
                      alt={color.name}
                      fill
                      sizes="(max-width: 640px) 25vw, 120px"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundColor: color.hexCode ?? "#e4e4e7",
                      }}
                    />
                  )}

                  {/* Selected Indicator Check */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </div>
                  )}

                  {/* Out of Stock Overlay */}
                  {isSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <div className="h-px w-full rotate-45 bg-zinc-400" />
                    </div>
                  )}
                </div>

                {/* Swatch Dot & Color Name */}
                <div className="flex items-center gap-1.5 px-1 pt-1.5 pb-0.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full border border-black/10"
                    style={{
                      backgroundColor: color.hexCode ?? "#e4e4e7",
                    }}
                  />
                  <span
                    className={`truncate text-[11px] font-medium leading-tight ${
                      isSelected
                        ? "text-zinc-900 font-semibold"
                        : "text-zinc-600"
                    }`}
                  >
                    {color.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SIZES FOR SELECTED COLOR ONLY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-zinc-500">
            {colorSizes[0]?.optionName || "Size"}
          </span>
          <span className="font-semibold text-zinc-900">
            {selectedVariant.optionValue}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {colorSizes.map((variant) => {
            const isSelected = selectedVariant.id === variant.id;
            const isOutOfStock = (variant.stock ?? 0) <= 0;

            return (
              <button
                key={variant.id}
                type="button"
                disabled={isOutOfStock}
                onClick={() => setSelectedVariant(variant)}
                className={`relative min-w-11 h-10 px-3.5 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150 border focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${
                  isSelected
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                    : isOutOfStock
                    ? "border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed line-through"
                    : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer"
                }`}
              >
                {variant.optionValue}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRICE & STOCK DISPLAY */}
      <div className="pt-3 border-t border-zinc-100 space-y-1">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold tracking-tight text-zinc-900">
            <Price price={Number(selectedVariant.price)} />
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              (selectedVariant.stock ?? 0) > 0
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                (selectedVariant.stock ?? 0) > 0
                  ? "bg-emerald-500"
                  : "bg-red-500"
              }`}
            />
            {(selectedVariant.stock ?? 0) > 0
              ? `${selectedVariant.stock} in stock`
              : "Out of stock"}
          </div>
        </div>
      </div>

      {/* 4. ACTIONS */}
      <div className="flex items-center gap-3 pt-1">
        <div className="grow">
          <AddToCartButton item={item} />
        </div>
        <WishlistButton item={item} />
      </div>
    </div>
  );
}