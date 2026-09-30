"use client";

import { useMemo, useState } from "react";
import type { ProductWithDetails } from "@africasuk/types";
import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductWithDetails[];
}

export default function CategoryProducts({ products }: Props) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  /*
   * Create one product card for every product color.
   */
  const colorProducts = useMemo(() => {
    return products.flatMap((product) =>
      product.colors.map((color) => ({
        ...product,
        id: `${product.id}-${color.id}`,
        name: `${product.name} - ${color.name}`,
        colors: [color],
      }))
    );
  }, [products]);

  /*
   * Available colors
   */
  const availableColors = useMemo(() => {
    return Array.from(
      new Set(
        colorProducts
          .map((product) => product.colors[0]?.name)
          .filter(Boolean)
      )
    ).sort();
  }, [colorProducts]);

  /*
   * Highest price in the category.
   */
  const highestPrice = useMemo(() => {
    const prices = colorProducts.flatMap((product) =>
      product.colors.flatMap((color) =>
        color.variants?.map((variant) => Number(variant.price)) ?? []
      )
    );

    if (prices.length === 0) return 0;

    return Math.max(...prices);
  }, [colorProducts]);

  /*
   * Filter products
   */
  const filteredProducts = useMemo(() => {
    return colorProducts.filter((product) => {
      const color = product.colors[0];

      if (!color) return false;

      /*
       * COLOR FILTER
       */
      if (
        selectedColors.length > 0 &&
        !selectedColors.includes(color.name)
      ) {
        return false;
      }

      /*
       * PRICE FILTER
       */
      if (maxPrice !== null) {
        const hasPriceInRange = color.variants?.some(
          (variant) => Number(variant.price) <= maxPrice
        );

        if (!hasPriceInRange) {
          return false;
        }
      }

      return true;
    });
  }, [colorProducts, selectedColors, maxPrice]);

  /*
   * Toggle color
   */
  const toggleColor = (color: string) => {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color]
    );
  };

  /*
   * Clear all filters
   */
  const clearFilters = () => {
    setSelectedColors([]);
    setMaxPrice(null);
  };

  if (colorProducts.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* FILTER BAR */}
      <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* COLORS */}
          {availableColors.length > 0 && (
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Color
                </h3>

                {selectedColors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedColors([])}
                    className="text-xs font-medium text-[#005c2e] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => {
                  const active = selectedColors.includes(color);

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={[
                        "rounded-full border px-4 py-2 text-xs font-medium transition",
                        active
                          ? "border-[#005c2e] bg-[#005c2e] text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400",
                      ].join(" ")}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PRICE */}
          {highestPrice > 0 && (
            <div className="w-full lg:max-w-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Price
                </h3>

                <span className="text-xs font-medium text-neutral-600">
                  {maxPrice !== null
                    ? `Up to ${maxPrice.toLocaleString()}`
                    : `Up to ${highestPrice.toLocaleString()}`}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={highestPrice}
                value={maxPrice ?? highestPrice}
                onChange={(event) =>
                  setMaxPrice(Number(event.target.value))
                }
                className="w-full accent-[#005c2e]"
              />

              <div className="mt-1 flex justify-between text-[11px] text-neutral-400">
                <span>0</span>
                <span>{highestPrice.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* CLEAR ALL */}
          {(selectedColors.length > 0 || maxPrice !== null) && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-10 shrink-0 rounded-lg border border-neutral-200 px-4 text-xs font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* RESULT COUNT */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Showing{" "}
          <span className="font-semibold text-neutral-900">
            {filteredProducts.length}
          </span>{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* PRODUCTS */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
          <h3 className="text-base font-semibold text-neutral-900">
            No products match your filters
          </h3>

          <p className="mt-2 text-sm text-neutral-500">
            Try changing your color or price filters.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-lg bg-[#005c2e] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#004b25]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            gap-x-3
            gap-y-8
            sm:grid-cols-3
            sm:gap-x-4
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-6
          "
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}