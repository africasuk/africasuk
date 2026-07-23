"use client";

import Link from "next/link";
import type { ProductWithDetails } from "@africasuk/types";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

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
    <section className="bg-gray-50/50 py-16 lg:py-20 antialiased selection:bg-[#002b15]/10 border-y border-gray-100 select-none">
      <Container>
        <SectionHeader
          title="Featured Products"
          description="Hand-picked premium selections curated exclusively for you."
          action={
            <Button
              asChild
              variant="outline"
              className="rounded-full border-gray-200 font-bold text-xs sm:text-sm text-gray-800 transition-all duration-300 hover:border-[#005c2e] hover:bg-[#002b15] hover:text-white"
            >
              <Link href="/products">View All Collection</Link>
            </Button>
          }
        />

        {/* Product Grid - Fixed squeezed issue by using spacious responsive columns */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {featuredColorProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}