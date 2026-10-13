
import type { ProductWithDetails } from "@africasuk/types";
import { convertPrice } from "@/lib/currency";

type SearchPriceProduct = ProductWithDetails & {
  selectedColorId?: string;
};

export type SearchPriceRange = {
  min: number;
  max: number;
};

/** Returns the lowest USD variant price for the selected color. */
export function getSearchProductPrice(
  product: SearchPriceProduct,
): number | null {
  const record = product as unknown as Record<
    string,
    unknown
  >;

  const colors = Array.isArray(record.colors)
    ? record.colors
    : [];

  const selectedColorId = product.selectedColorId;

  const relevantColors = selectedColorId
    ? colors.filter((entry) => {
        if (!entry || typeof entry !== "object") {
          return false;
        }

        return (
          String(
            (entry as Record<string, unknown>).id ?? "",
          ) === selectedColorId
        );
      })
    : colors;

  const prices: number[] = [];

  for (const entry of relevantColors) {
    if (!entry || typeof entry !== "object") {
      continue;
    }

    const color = entry as Record<string, unknown>;

    const variants = Array.isArray(color.variants)
      ? color.variants
      : [];

    for (const variant of variants) {
      if (!variant || typeof variant !== "object") {
        continue;
      }

      const price = Number(
        (variant as Record<string, unknown>).price,
      );

      if (Number.isFinite(price) && price >= 0) {
        prices.push(price);
      }
    }
  }

  if (prices.length > 0) {
    return Math.min(...prices);
  }

  const fallback = Number(record.price);

  return Number.isFinite(fallback) && fallback >= 0
    ? fallback
    : null;
}

/** Calculates the available range in the selected display currency. */
export function getSearchPriceRange(
  products: SearchPriceProduct[],
  currency: Parameters<typeof convertPrice>[1],
  rate: Parameters<typeof convertPrice>[2],
): SearchPriceRange {
  const prices = products
    .map(getSearchProductPrice)
    .filter(
      (price): price is number => price !== null,
    )
    .map((price) =>
      convertPrice(price, currency, rate),
    )
    .filter((price) => Number.isFinite(price));

  if (prices.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
