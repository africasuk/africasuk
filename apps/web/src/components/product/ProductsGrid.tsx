"use client";

import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "@/components/products/ProductCard";


interface Props {
  products: ProductWithDetails[];
}


export default function ProductGrid({
  products,
}: Props) {

  return (
    <div
      className="
      grid
      grid-cols-2
      gap-4
      sm:grid-cols-3
      md:grid-cols-4
      lg:grid-cols-5
      xl:grid-cols-6
      "
    >

      {products.flatMap((product) =>
        product.colors.map((color) => {

          const variant =
            color.variants?.[0];


          if (!variant) return null;


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