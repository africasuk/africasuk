"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProductWithDetails } from "@africasuk/types";

import Container from "@/components/layout/Container";
import SectionHeader from "../shared/SectionHeader";
import { ProductCard } from "../products/ProductCard";

interface Props {
  products: ProductWithDetails[];
}

export default function FeaturedProducts({ products = [] }: Props) {
  const featured = products.filter(
    (product) => product.isActive && product.colors?.length > 0
  );

  if (featured.length === 0) {
    return null;
  }

  // Flatten and filter out colors without valid variants
  const featuredColorProducts = featured
    .flatMap((product) =>
      product.colors
        .filter((color) => color.variants && color.variants.length > 0)
        .map((color) => ({
          ...product,
          id: `${product.id}-${color.id}`,
          name: `${product.name} - ${color.name}`,
          selectedColorId: color.id,
          colors: [color],
        }))
    )
    .slice(0, 24); // 1. Increased slice limit to fill 2-3 full rows on ultra-wide screens

  return (
    <section className="bg-white py-12 sm:py-16 antialiased border-y border-gray-100 select-none">
      <Container className="max-w-none w-full px-4 sm:px-6 lg:px-12">
        <SectionHeader
          title="Featured Products"
          description="Hand-picked premium selections curated exclusively for you."
          action={
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#005c2e] hover:text-[#002b15] transition-colors shrink-0"
            >
              <span>View All Collection</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          }
        />

        {/* 
          2. auto-fit stretches grid tracks gracefully to fill empty space edge-to-edge
        */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] lg:gap-6">
          {featuredColorProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}