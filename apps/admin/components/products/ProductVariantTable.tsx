import type { ProductVariant } from "@africasuk/types";

interface Props {
  variants: ProductVariant[];
}

export function ProductVariantTable({
  variants,
}: Props) {
  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Option</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">SKU</th>
          </tr>
        </thead>

        <tbody>
          {variants.map((variant) => (
            <tr
              key={variant.id}
              className="border-b"
            >
              <td className="p-3">
                {variant.optionValue}
              </td>

              <td className="p-3">
                ${variant.price}
              </td>

              <td className="p-3">
                {variant.stock}
              </td>

              <td className="p-3">
                {variant.sku ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}