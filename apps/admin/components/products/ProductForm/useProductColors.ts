"use client";

import { useState } from "react";

import type { ProductWithDetails } from "@africasuk/types";
import type { Color, Variant } from "./types";

export function useProductColors(product?: ProductWithDetails) {
  const [colors, setColors] = useState<Color[]>(
    product?.colors.map((color) => ({
      name: color.name,
      optionName: color.variants[0]?.optionName ?? "",
      images: color.images.map((image) => ({
        id: image.id,
        url: image.imageUrl,
      })),
      variants: color.variants.map((variant) => ({
        optionValue: variant.optionValue,
        price: variant.price,
        stock: variant.stock,
        sku: variant.sku ?? "",
      })),
    })) ?? []
  );

  const addColor = () => {
    setColors((prev) => [
      ...prev,
      {
        name: "",
        optionName: "",
        images: [],
        variants: [],
      },
    ]);
  };

  const removeColor = (colorIndex: number) => {
    setColors((prev) =>
      prev.filter((_, index) => index !== colorIndex)
    );
  };

  const updateColorField = <K extends keyof Color>(
    colorIndex: number,
    field: K,
    value: Color[K]
  ) => {
    setColors((prev) =>
      prev.map((color, index) =>
        index === colorIndex
          ? {
              ...color,
              [field]: value,
            }
          : color
      )
    );
  };

  const addVariant = (colorIndex: number) => {
    setColors((prev) =>
      prev.map((color, index) =>
        index === colorIndex
          ? {
              ...color,
              variants: [
                ...color.variants,
                {
                  optionValue: "",
                  price: 0,
                  stock: 0,
                  sku: "",
                },
              ],
            }
          : color
      )
    );
  };

  const removeVariant = (
    colorIndex: number,
    variantIndex: number
  ) => {
    setColors((prev) =>
      prev.map((color, index) =>
        index === colorIndex
          ? {
              ...color,
              variants: color.variants.filter(
                (_, i) => i !== variantIndex
              ),
            }
          : color
      )
    );
  };

  const updateVariantField = <K extends keyof Variant>(
    colorIndex: number,
    variantIndex: number,
    field: K,
    value: Variant[K]
  ) => {
    setColors((prev) =>
      prev.map((color, cIndex) =>
        cIndex === colorIndex
          ? {
              ...color,
              variants: color.variants.map((variant, vIndex) =>
                vIndex === variantIndex
                  ? {
                      ...variant,
                      [field]: value,
                    }
                  : variant
              ),
            }
          : color
      )
    );
  };

  return {
    colors,
    setColors,
    addColor,
    removeColor,
    updateColorField,
    addVariant,
    removeVariant,
    updateVariantField,
  };
}