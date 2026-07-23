"use client";

import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "@/components/products/ProductCard";


interface Props {
  products: ProductWithDetails[];
}


export default function SearchProductGrid({
  products,
}: Props) {

  return (
    <div
      className="
        grid
        grid-cols-2
        md:grid-cols-4
        lg:grid-cols-5
        gap-5
      "
    >

      {products.flatMap((product) =>
        (product.colors ?? []).map((color) => {

          if (!color.variants?.length) {
            return null;
          }

          return (
            <ProductCard
              key={`${product.id}-${color.id}`}
              product={{
                ...product,
                name: `${product.name} - ${color.name}`,
                colors: [color],
              }}
            />
          );

        })
      )}

    </div>
  );
}