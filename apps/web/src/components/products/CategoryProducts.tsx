
"use client";

import { useMemo, useState } from "react";
import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "@/components/currency/Price";
import { ProductCard } from "./ProductCard";
import CategoryFilterPanel from "./CategoryFilterPanel";

interface Props {
  products: ProductWithDetails[];
}

export default function CategoryProducts({ products }: Props) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  // Create one product card for every product color.
  const colorProducts = useMemo(() => {
    return products.flatMap((product) =>
      product.colors.map((color) => ({
        ...product,
        id: `${product.id}-${color.id}`,
        name: `${product.name} - ${color.name}`,
        colors: [color],
      })),
    );
  }, [products]);

  // Available colors.
  const availableColors = useMemo(() => {
    return Array.from(
      new Set(
        colorProducts
          .map((product) => product.colors[0]?.name)
          .filter((color): color is string => Boolean(color)),
      ),
    ).sort();
  }, [colorProducts]);

  // Highest variant price.
  const highestPrice = useMemo(() => {
    const prices = colorProducts.flatMap((product) =>
      product.colors.flatMap(
        (color) =>
          color.variants?.map((variant) => Number(variant.price)) ?? [],
      ),
    );

    return prices.length > 0 ? Math.max(...prices) : 0;
  }, [colorProducts]);

  // Apply filters.
  const filteredProducts = useMemo(() => {
    return colorProducts.filter((product) => {
      const color = product.colors[0];

      if (!color) return false;

      if (
        selectedColors.length > 0 &&
        !selectedColors.includes(color.name)
      ) {
        return false;
      }

      if (maxPrice !== null) {
        const hasPriceInRange = color.variants?.some(
          (variant) => Number(variant.price) <= maxPrice,
        );

        if (!hasPriceInRange) return false;
      }

      return true;
    });
  }, [colorProducts, selectedColors, maxPrice]);

  const toggleColor = (color: string) => {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color],
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setMaxPrice(null);
  };

  const activeFilterCount =
    selectedColors.length + (maxPrice !== null ? 1 : 0);

  if (colorProducts.length === 0) {
    return (
      <div className="py-16 text-center text-neutral-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Compact toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            Explore collection
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "item" : "items"} available
          </p>
        </div>

        <CategoryFilterPanel
          activeFilterCount={activeFilterCount}
          onClear={clearFilters}
        >
          <div className="space-y-7">
            {/* Color filter */}
            {availableColors.length > 0 && (
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-neutral-900">
                    Color
                  </h3>

                  {selectedColors.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedColors([])}
                      className="text-xs font-semibold text-[#005c2e] hover:underline"
                    >
                      Reset
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
                        aria-pressed={active}
                        onClick={() => toggleColor(color)}
                        className={`rounded-full border px-4 py-2.5 text-xs font-semibold transition-all ${
                          active
                            ? "border-[#005c2e] bg-[#005c2e] text-white"
                            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Maximum price filter */}
            {highestPrice > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-neutral-900">
                    Maximum price
                  </h3>

                  <span className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-bold tabular-nums text-neutral-800">
                    <Price price={maxPrice ?? highestPrice} />
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
                  aria-label="Maximum price"
                  className="w-full cursor-pointer accent-[#005c2e]"
                />

                <div className="mt-2 flex justify-between text-[11px] text-neutral-400">
                  <span>
                    <Price price={0} />
                  </span>
                  <span>
                    <Price price={highestPrice} />
                  </span>
                </div>

                {maxPrice !== null && (
                  <button
                    type="button"
                    onClick={() => setMaxPrice(null)}
                    className="mt-3 text-xs font-semibold text-[#005c2e] hover:underline"
                  >
                    Remove price limit
                  </button>
                )}
              </section>
            )}
          </div>
        </CategoryFilterPanel>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs text-neutral-500">
            Applied:
          </span>

          {selectedColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => toggleColor(color)}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-400"
            >
              {color}
              <span aria-hidden="true">×</span>
            </button>
          ))}

          {maxPrice !== null && (
            <button
              type="button"
              onClick={() => setMaxPrice(null)}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-400"
            >
              Max price: <Price price={maxPrice} />
              <span aria-hidden="true">×</span>
            </button>
          )}

          <button
            type="button"
            onClick={clearFilters}
            className="px-2 py-1 text-xs font-semibold text-[#005c2e] hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
          <h3 className="text-base font-semibold text-neutral-900">
            No products match your filters
          </h3>

          <p className="mt-2 text-sm text-neutral-500">
            Try adjusting your color or price selection.
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
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
