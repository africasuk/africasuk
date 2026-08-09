"use client";

import { useState } from "react";
import type {
  ProductWithDetails,
  Review,
} from "@africasuk/types";

import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { RelatedProducts } from "./RelatedProducts";
import { Reviews } from "./Reviews";
import SocialLinks from "@/components/layout/footer/SocialLinks";

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
  const [selectedColor, setSelectedColor] = useState(
    product.colors.find((color) => color.id === selectedColorId) ??
      product.colors[0]
  );

  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-8 lg:p-12 bg-white/70 backdrop-blur-xs rounded-3xl border border-gray-100/80 shadow-xs select-none antialiased space-y-12">
      {/* Main Grid Section: Details/Info Left, Product Gallery Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Product Details & Social Footer */}
        <div className="lg:col-span-5 space-y-8 order-2 lg:order-1 flex flex-col justify-between h-full">
          <ProductInfo product={product} />

          {/* Social Links Placement */}
          <div className="pt-6 border-t border-gray-100">
            <SocialLinks />
          </div>
        </div>

        {/* Right Column: Product Gallery */}
        <div className="lg:col-span-7 order-1 lg:order-2 relative">
          <ProductGallery
            images={
              selectedColor?.images ??
              product.colors.flatMap((c) => c.images ?? [])
            }
          />
        </div>
      </div>

      {/* Options Bar: Color Selection & Variant Selector */}
      <div className="pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Color Palette Selector */}
        <div className="space-y-3">
          <span className="text-xs font-medium text-gray-500">
            Select Color
          </span>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => {
              const isSelected = selectedColor?.id === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-[#002b15] text-white shadow-xs ring-2 ring-[#005c2e]/20 ring-offset-2"
                      : "bg-gray-50/80 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/60"
                  }`}
                >
                  {color.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Variant / Size Selector */}
        <div>
          <VariantSelector
            product={{
              ...product,
              colors: selectedColor ? [selectedColor] : [],
            }}
          />
        </div>
      </div>

      {/* Customer Reviews */}
      <Reviews
        reviews={reviews}
        rating={rating}
      />

      {/* Bottom Section: Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-gray-100">
          <h3 className="text-xl font-semibold tracking-tight text-gray-900 mb-8">
            Recommended for You
          </h3>
          <RelatedProducts
            products={relatedProducts}
          />
        </div>
      )}
    </div>
  );
}