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
    .slice(0, 12);

  return (
    <section className="bg-white py-12 sm:py-16 antialiased border-y border-gray-100 select-none">
      <Container>
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

        {/* Product Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {featuredColorProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}