"use client";

import { useState } from "react";
import type { ProductWithDetails, Review } from "@africasuk/types";
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
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
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
  const [selectedColor, setSelectedColor] =
    useState<ColorWithDetails>(
      product.colors.find(
        (color) => color.id === selectedColorId
      ) ?? product.colors[0]
    );

  const formattedRating = Number(
    rating.averageRating || 0
  ).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-16 select-none antialiased">

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={
              selectedColor?.images &&
              selectedColor.images.length > 0
                ? selectedColor.images
                : product.colors.flatMap(
                    (color) => color.images ?? []
                  )
            }
          />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">

          {/* Product Information */}
          <ProductInfo product={product} />

          {/* Rating Summary */}
          <div className="pt-1">
            <div className="flex items-center gap-2.5">
              <RatingStars
                rating={rating.averageRating}
              />

              <span className="text-sm font-semibold text-gray-900">
                {formattedRating}
              </span>

              <span className="text-xs text-gray-400">
                ({rating.reviewCount}{" "}
                {rating.reviewCount === 1
                  ? "review"
                  : "reviews"}
                )
              </span>
            </div>
          </div>

          {/* Variant Selector */}
          <div className="pt-2">
            <VariantSelector
              product={product}
              onColorChange={setSelectedColor}
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 sm:pt-10 border-t border-gray-100 space-y-6">
          <h3 className="text-sm sm:text-base font-semibold tracking-tight text-gray-900">
            Recommended for You
          </h3>

          <RelatedProducts products={relatedProducts} />
        </div>
      )}

      {/* Customer Reviews - Under Related Products */}
      <Reviews
        reviews={reviews}
        rating={rating}
      />

    </div>
  );
}