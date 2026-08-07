"use client";

import { useState } from "react";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { VariantSelector } from "./VariantSelector";
import { RelatedProducts } from "./RelatedProducts";
import SocialLinks from "@/components/layout/footer/SocialLinks";

interface Props {
  product: ProductWithDetails;
  selectedColorId?: string;
  relatedProducts?: ProductWithDetails[];
}

export function ProductDetails({
  product,
  selectedColorId,
  relatedProducts = [],
}: Props) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors.find((color) => color.id === selectedColorId) ??
      product.colors[0]
  );

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 bg-gray-50/50 rounded-3xl select-none antialiased">
      {/* Main Grid Section: Details/Info Left, Product Gallery Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Product Details & Social Footer */}
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
          <ProductInfo product={product} />

          {/* Social Links Placement */}
          <div className="pt-4 border-t border-gray-200/80">
            <SocialLinks />
          </div>
        </div>

        {/* Right Column: Product Gallery */}
        <div className="lg:col-span-7 order-1 lg:order-2 relative">
          <ProductGallery
            images={selectedColor?.images ?? []}
          />
        </div>
      </div>

      {/* Options Bar: Color Selection & Variant Selector */}
      <div className="mt-10 pt-8 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Color Palette Selector */}
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
            Color
          </span>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((color) => {
              const isSelected = selectedColor?.id === color.id;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
                    isSelected
                      ? "bg-linear-to-r from-[#002b15] to-[#005c2e] text-white shadow-2xs ring-2 ring-[#005c2e]/40 ring-offset-2"
                      : "bg-white text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 border border-gray-200"
                  }`}
                >
                  {color.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Variant / Size Selector - Preserved Exactly */}
        <div>
          <VariantSelector
            product={{
              ...product,
              colors: selectedColor ? [selectedColor] : [],
            }}
          />
        </div>
      </div>

      {/* Bottom Section: Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6">
            Recommended For You
          </h3>
          <RelatedProducts
                products={relatedProducts}
              />
        </div>
      )}
    </div>
  );
}