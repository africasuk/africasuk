"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ProductWithDetails } from "@africasuk/types";
import Container from "@/components/layout/Container";
import SectionHeader from "../shared/SectionHeader";
import { ProductCard } from "../products/ProductCard";

interface Props {
  products: ProductWithDetails[];
}

export default function FeaturedProducts({
  products = [],
}: Props) {
  const featured = products.filter(
    (product) =>
      product.isActive &&
      product.colors?.length > 0
  );

  if (featured.length === 0) {
    return null;
  }

  type FeaturedColorProduct = {
    product: ProductWithDetails;
    color: ProductWithDetails["colors"][number];
  };

  // Group valid colors by product
  const groupedProducts: FeaturedColorProduct[][] =
    featured.map((product) =>
      product.colors
        .filter(
          (color) =>
            color.variants &&
            color.variants.length > 0
        )
        .map((color) => ({
          product,
          color,
        }))
    );

  // Mix products by taking one color from each
  // product before taking the next color.
  const featuredColorProducts = [];

  const maxColors = Math.max(
    0,
    ...groupedProducts.map(
      (group) => group.length
    )
  );

  for (
    let index = 0;
    index < maxColors;
    index++
  ) {
    for (const group of groupedProducts) {
      const item = group[index];

      if (!item) continue;

      featuredColorProducts.push({
        ...item.product,

        id: `${item.product.id}-${item.color.id}`,

        name: `${item.product.name} - ${item.color.name}`,

        selectedColorId: item.color.id,

        colors: [item.color],
      });
    }
  }

  const displayedProducts =
    featuredColorProducts.slice(0, 50);

  return (
    <section className="bg-white py-12 sm:py-16 antialiased border-y border-gray-100 select-none">
      <Container className="max-w-none w-full px-4 sm:px-6 lg:px-12">
        <SectionHeader
          title="Featured Products"
          description="Explore products available from Africa Suk."
          action={
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#005c2e] hover:text-[#002b15] transition-colors shrink-0"
            >
              <span>
                View All Collection
              </span>

              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          }
        />

        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-6">
          {displayedProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      <div className="mt-10 flex justify-center">
        <Link
          href="/products"
          className="group inline-flex items-center gap-3 rounded-full bg-gray-950 px-6 py-3.5 text-xs font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#008744] hover:shadow-lg hover:shadow-[#008744]/20 active:scale-95 sm:text-sm"
        >
          <span>View All Products</span>

          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowRight className="h-3 w-3 text-white" />
          </div>
        </Link>
      </div>
      </Container>
    </section>
  );
}