"use client";

import { useState } from "react";
import type { ProductWithDetails, Review } from "@africasuk/types";

import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { RelatedProducts } from "./RelatedProducts";
import { Reviews } from "./Reviews";
import SocialLinks from "@/components/layout/footer/SocialLinks";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-16 select-none antialiased">
      {/* Main Section: Gallery (Left) + Purchase & Info Pane (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={
              selectedColor?.images && selectedColor.images.length > 0
                ? selectedColor.images
                : product.colors.flatMap((c) => c.images ?? [])
            }
          />
        </div>

        {/* Right Column: Details, Variant Selector, Actions & Share */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Product Information */}
          <ProductInfo product={product} />

          {/* Color, Size, Stock, Pricing & Add-to-Cart */}
          <div className="pt-2">
            <VariantSelector
              product={product}
              onColorChange={setSelectedColor}
            />
          </div>

          {/* Social Links */}
          <div className="pt-5 border-t border-gray-100">
            <span className="text-[11px] uppercase tracking-wider text-gray-400 font-medium block mb-2.5">
              Share this product
            </span>
            <SocialLinks />
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <Reviews reviews={reviews} rating={rating} />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-8 sm:pt-10 border-t border-gray-100 space-y-6">
          <h3 className="text-sm sm:text-base font-semibold tracking-tight text-gray-900">
            Recommended for You
          </h3>
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  );
}