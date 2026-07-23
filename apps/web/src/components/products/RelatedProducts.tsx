import Link from "next/link";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductWithDetails[];
}

export function RelatedProducts({
  products,
}: Props) {

  if (!products.length) {
    return null;
  }

  return (
    <section className="space-y-6">

      <h2 className="text-2xl font-bold">
        Related Products
      </h2>


      <div className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-5
        gap-4
      ">

        {products.map((product) => (

          <Link
            key={product.id}
            href={`/products/${product.slug}`}
          >
            <ProductCard
              product={product}
            />
          </Link>

        ))}

      </div>

    </section>
  );
}