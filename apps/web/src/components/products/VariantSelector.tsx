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
    <div className="space-y-5 select-none antialiased">
      {/* 1. COLOR SELECTION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 font-normal">
          <span className="uppercase tracking-wider">Color</span>
          <span className="text-gray-900 font-medium capitalize">
            {selectedColor.name}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
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
                className={`group relative flex items-center gap-2 rounded-none px-2.5 py-1.5 text-xs transition-colors duration-150 border cursor-pointer ${
                  isSelected
                    ? "border-[#004d26] bg-[#004d26]/5 text-[#004d26] font-medium"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 font-normal"
                }`}
              >
                {/* Sharp Swatch Thumbnail */}
                <div className="relative h-4 w-4 rounded-none overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                  {color.images[0]?.imageUrl ? (
                    <Image
                      src={color.images[0].imageUrl}
                      alt={color.name}
                      fill
                      sizes="16px"
                      className="object-cover"
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

      {/* 2. SIZE SELECTION */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 font-normal">
          <span className="uppercase tracking-wider">
            {allSizes[0]?.optionName || "Size"}
          </span>
          <span className="text-gray-900 font-medium">
            {selectedVariant.optionValue}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                className={`min-w-9 h-8 sm:min-w-10 sm:h-9 px-2.5 sm:px-3 flex items-center justify-center rounded-none text-xs transition-colors border cursor-pointer ${
                  isSelected
                    ? "border-[#004d26] bg-[#004d26] text-white font-medium shadow-none"
                    : isAvailableInCurrentColor
                    ? "border-gray-200 bg-white text-gray-700 hover:border-gray-400 font-normal"
                    : "border-dashed border-gray-200 bg-gray-50 text-gray-400 font-normal hover:border-gray-300"
                }`}
              >
                {size.value}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRICE & STOCK DISPLAY */}
      <div className="pt-2 border-t border-gray-100 space-y-1">
        <div className="flex items-baseline gap-2.5">
          <div className="text-lg sm:text-xl font-semibold text-[#004d26] tracking-tight">
            <Price price={Number(selectedVariant.price)} />
          </div>

          <span
            className={`text-xs font-normal ${
              selectedVariant.stock > 0
                ? "text-[#004d26]"
                : "text-red-500"
            }`}
          >
            {selectedVariant.stock > 0
              ? `${selectedVariant.stock} in stock`
              : "Out of stock"}
          </span>
        </div>
      </div>

      {/* 4. ACTIONS */}
      <div className="flex items-center gap-2 pt-1">
        <div className="grow">
          <AddToCartButton item={item} />
        </div>
        <WishlistButton item={item} />
      </div>
    </div>
  );
}