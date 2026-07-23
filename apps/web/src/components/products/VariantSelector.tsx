"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
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

  // Helper to handle color updates and inform the parent gallery
  const updateSelectedColor = (color: ColorWithDetails) => {
    setSelectedColor(color);
    if (onColorChange) {
      onColorChange(color);
    }
  };

  const allSizes = useMemo(() => {
    const sizeMap = new Map<string, { optionName: string; value: string }>();
    product.colors.forEach((c) => {
      c.variants.forEach((v) => {
        if (!sizeMap.has(v.optionValue)) {
          sizeMap.set(v.optionValue, {
            optionName: v.optionName || "SIZE",
            value: v.optionValue,
          });
        }
      });
    });
    return Array.from(sizeMap.values());
  }, [product]);

  if (!selectedColor || !selectedVariant) {
    return null;
  }

  const handleSizeSelect = (sizeValue: string) => {
    const matchingVariantInCurrentColor = selectedColor.variants.find(
      (v) => v.optionValue === sizeValue
    );

    if (matchingVariantInCurrentColor) {
      setSelectedVariant(matchingVariantInCurrentColor);
      return;
    }

    const colorWithSize = product.colors.find((c) =>
      c.variants.some((v) => v.optionValue === sizeValue)
    );

    if (colorWithSize) {
      updateSelectedColor(colorWithSize);
      const variant = colorWithSize.variants.find(
        (v) => v.optionValue === sizeValue
      );
      if (variant) {
        setSelectedVariant(variant);
      }
    }
  };

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
        optionName: selectedVariant.optionName,
        value: selectedVariant.optionValue,
      },
    ],
    quantity: 1,
  };

  return (
    <div className="space-y-6">
      {/* 1. COLOR SELECTION */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-gray-500 uppercase">
          <span>COLOR</span>
          <span className="text-gray-900 font-bold capitalize">
            {selectedColor.name}
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {product.colors.map((color) => {
            const isSelected = selectedColor.id === color.id;

            return (
              <button
                key={color.id}
                type="button"
                onClick={() => {
                  updateSelectedColor(color);
                  const matchingVariant = color.variants.find(
                    (v) => v.optionValue === selectedVariant.optionValue
                  );
                  setSelectedVariant(matchingVariant ?? color.variants[0]);
                }}
                className={`group relative flex items-center gap-2.5 rounded-full pl-1.5 pr-4 py-1.5 text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? "border-[#005c2e] bg-emerald-50/60 text-[#005c2e] ring-2 ring-[#005c2e]/20 ring-offset-1"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {/* Clean, Framed Thumbnail Bubble */}
                <div className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-black/10 shrink-0 bg-gray-100">
                  {color.images[0]?.imageUrl ? (
                    <Image
                      src={color.images[0].imageUrl}
                      alt={color.name}
                      fill
                      sizes="24px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundColor: color.hexCode ?? "#e5e7eb",
                      }}
                    />
                  )}
                </div>

                <span>{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SIZES */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase block">
          {allSizes[0]?.optionName || "SIZE"}
        </span>

        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => {
            const isSelected = selectedVariant.optionValue === size.value;
            const isAvailableInCurrentColor = selectedColor.variants.some(
              (v) => v.optionValue === size.value
            );

            return (
              <button
                key={size.value}
                type="button"
                onClick={() => handleSizeSelect(size.value)}
                className={`min-w-10 h-9 px-3.5 flex items-center justify-center rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                  isSelected
                    ? "border-transparent bg-linear-to-r from-[#002b15] to-[#005c2e] text-white shadow-2xs"
                    : isAvailableInCurrentColor
                    ? "border-gray-200 bg-white text-gray-700 hover:border-[#005c2e]/40 hover:text-[#005c2e]"
                    : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-300"
                }`}
              >
                {size.value}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRICE & STOCK DISPLAY */}
      <div className="space-y-1 pt-1 border-t border-gray-100">
        <div className="flex items-baseline gap-3">
          <div className="text-2xl font-black text-[#005c2e] tracking-tight">
            <Price price={Number(selectedVariant.price)} />
          </div>

          <span
            className={`text-xs font-medium ${
              selectedVariant.stock > 0
                ? "text-emerald-700 font-semibold"
                : "text-red-500 font-semibold"
            }`}
          >
            {selectedVariant.stock > 0
              ? `${selectedVariant.stock} in stock`
              : "Out of stock"}
          </span>
        </div>
      </div>

      {/* 4. ACTIONS */}
      <div className="flex items-center gap-3 pt-2">
        <div className="grow">
          <AddToCartButton item={item} />
        </div>
        <WishlistButton item={item} />
      </div>
    </div>
  );
}