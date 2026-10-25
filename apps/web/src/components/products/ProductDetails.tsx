"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ProductWithDetails, Review } from "@africasuk/types";

import { useCurrencyPrice } from "hooks/useCurrencyPrice";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { RelatedProducts } from "./RelatedProducts";
import { Reviews } from "./Reviews";

type ColorWithDetails = ProductWithDetails["colors"][number];

interface Props {
  product: ProductWithDetails;
  selectedColorId?: string;
  relatedProducts?: ProductWithDetails[];
  reviews?: Review[];
  rating?: {
    averageRating: number;
    reviewCount: number;
  };
}

function RatingStars({ rating }: { rating: number }) {
  const roundedRating = Math.round(rating);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-3.5 w-3.5 ${
            index < roundedRating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function QuickProductShare({
  productName,
  price,
}: {
  productName: string;
  price: number | null;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const { formatted } = useCurrencyPrice(price ?? 0);

  async function copyOrderMessage() {
    if (price === null) {
      setError(true);
      return;
    }

    const shortName = productName.trim().split(/\s+/).slice(0, 2).join(" ");

    const productUrl = new URL(window.location.href);
    productUrl.protocol = "https:";
    productUrl.hostname = "africasuk.com";
    productUrl.port = "";

    const message = `${shortName} - ${formatted}\nClick To Order 👇\n${productUrl.toString()}`;

    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setError(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(true);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={copyOrderMessage}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:w-auto"
      >
        {copied ? <Check size={17} /> : <Copy size={17} />}
        {copied ? "Copied!" : "Copy to Post"}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {price === null
            ? "Price is still loading. Please try again."
            : "Copy failed. Please try again."}
        </p>
      )}

      {copied && (
        <p role="status" className="text-sm text-emerald-700">
          Ready to paste into WhatsApp!
        </p>
      )}
    </div>
  );
}

export function ProductDetails({
  product,
  selectedColorId,
  relatedProducts = [],
  reviews = [],
  rating = {
    averageRating: 0,
    reviewCount: 0,
  },
}: Props) {
  const [selectedColor, setSelectedColor] = useState<ColorWithDetails>(
    product.colors.find((color) => color.id === selectedColorId) ??
      product.colors[0]
  );

  const [priceUsd, setPriceUsd] = useState<number | null>(null);

  const formattedRating = Number(rating.averageRating || 0).toFixed(1);

  const selectedImages =
    selectedColor?.images && selectedColor.images.length > 0
      ? selectedColor.images
      : product.colors.flatMap((color) => color.images ?? []);

  return (
    <div className="mx-auto max-w-7xl select-none space-y-8 pb-24 pt-16 antialiased sm:space-y-12 sm:px-6 sm:py-8 lg:space-y-16 lg:px-8">
      {/* Main product section */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-12">
        {/* Product gallery */}
        <div className="min-w-0 lg:col-span-7">
          <ProductGallery images={selectedImages} />
        </div>

        {/* Product information */}
        <div className="min-w-0 space-y-5 px-4 sm:px-0 lg:col-span-5 lg:space-y-6">
          <ProductInfo product={product} />

          {/* Copy product name, current price, and production URL */}
          <QuickProductShare
            productName={product.name}
            price={priceUsd}
          />

          {/* Rating summary */}
          <div className="pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <RatingStars rating={rating.averageRating} />

              <span className="text-sm font-semibold text-gray-900">
                {formattedRating}
              </span>

              <span className="text-xs text-gray-400">
                ({rating.reviewCount}{" "}
                {rating.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>

          {/* Product variants */}
          <div className="pt-1 sm:pt-2">
            <VariantSelector
              key={product.id}
              product={product}
              onColorChange={setSelectedColor}
              onPriceChange={setPriceUsd}
            />
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4 border-t border-gray-100 px-4 pt-6 sm:space-y-6 sm:px-0 sm:pt-10">
          <h2 className="text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
            Recommended for You
          </h2>

          <RelatedProducts products={relatedProducts} />
        </section>
      )}

      {/* Customer reviews */}
      <section className="border-t border-gray-100 px-4 pt-6 sm:px-0 sm:pt-8">
        <Reviews reviews={reviews} rating={rating} />
      </section>
    </div>
  );
}