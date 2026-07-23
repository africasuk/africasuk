import type { ProductWithDetails } from "@africasuk/types";
import { ProductCard } from "./ProductCard";



interface Props {
  products: ProductWithDetails[];
}

export default function CategoryProducts({
  products,
}: Props) {

  const colorProducts = products.flatMap(
    (product) =>
      product.colors.map((color) => ({
        ...product,

        id: `${product.id}-${color.id}`,

        name: `${product.name} - ${color.name}`,

        colors: [color],
      }))
  );


  if (colorProducts.length === 0) {
    return (
      <div className="py-12 text-center text-neutral-500">
        No products found.
      </div>
    );
  }


  return (
    <div className="
      grid
      grid-cols-2
      md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]
      gap-4
      sm:gap-6
    ">
      {colorProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}