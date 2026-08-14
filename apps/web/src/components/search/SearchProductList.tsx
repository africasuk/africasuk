"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "@/components/currency/Price";
import { Badge } from "@/components/ui/badge";
import AddSearchCartButton from "./AddSearchCartButton";
import { WishlistButton } from "../products/WishlistButton";

interface Props {
  products: ProductWithDetails[];
}

export default function SearchProductList({ products }: Props) {
  const items = products.flatMap((product) =>
    (product.colors || []).map((color) => ({
      ...product,
      color,
      variant: color.variants?.[0],
      id: `${product.id}-${color.id}`,
    }))
  );

  return (
    <div className="space-y-2 select-none">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/products/${item.slug}?color=${item.color.id}`}
          className="group relative flex flex-col sm:flex-row gap-2.5 sm:gap-3.5 rounded-none border border-gray-200 bg-white p-2.5 sm:p-3 text-gray-900 transition-colors duration-150 hover:border-gray-400 shadow-none"
        >
          {/* Image Box */}
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-none border border-gray-100 bg-gray-50">
            <Image
              src={item.color.images?.[0]?.imageUrl ?? "/placeholder.png"}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 80px, 96px"
              className="object-cover transition-transform duration-300 group-hover:scale-102"
            />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-1">
            <h2 className="text-xs sm:text-sm font-medium tracking-tight text-gray-900 group-hover:text-[#004d26] transition-colors line-clamp-1">
              {item.name} - {item.color.name}
            </h2>

            {/* Brand & Category Info */}
            <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[11px] sm:text-xs text-gray-500 font-normal">
              {item.brand && (
                <span>
                  Brand:{" "}
                  <span className="text-gray-700 font-medium">
                    {item.brand.name}
                  </span>
                </span>
              )}
              {item.category && (
                <span>
                  Category:{" "}
                  <span className="text-gray-700 font-medium">
                    {item.category.name}
                  </span>
                </span>
              )}
            </div>

            {/* Variant Badges */}
            {item.variant && (
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <Badge
                  variant="secondary"
                  className="rounded-none border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-normal text-gray-600 tracking-normal"
                >
                  {item.variant.optionName}: {item.variant.optionValue}
                </Badge>

                <Badge
                  variant="outline"
                  className="rounded-none border-[#004d26]/20 bg-[#004d26]/5 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-[#004d26] tracking-normal"
                >
                  Stock: {item.variant.stock}
                </Badge>
              </div>
            )}

            {/* Price */}
            <div className="pt-0.5 text-xs sm:text-sm font-semibold text-[#004d26]">
              <Price price={item.variant?.price ?? 0} />
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-end gap-1.5 border-t border-gray-100 pt-2 sm:border-t-0 sm:pt-0 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <WishlistButton
              item={{
                productId: item.id,
                variantId: item.variant?.id ?? "",
                name: item.name,
                slug: item.slug,
                price: item.variant?.price ?? 0,
                stock: item.variant?.stock ?? 0,
                quantity: 1,
                allowCod: item.allowCod,
                allowOnlinePayment: item.allowOnlinePayment,
                image: item.color.images?.[0]?.imageUrl ?? "/placeholder.png",
                options: [
                  {
                    optionName: "Color",
                    value: item.color.name,
                  },
                  {
                    optionName: item.variant?.optionName ?? "",
                    value: item.variant?.optionValue ?? "",
                  },
                ],
              }}
            />
            <AddSearchCartButton
              item={{
                productId: item.id,
                variantId: item.variant?.id ?? "",
                name: item.name,
                slug: item.slug,
                price: item.variant?.price ?? 0,
                stock: item.variant?.stock ?? 0,
                quantity: 1,
                allowCod: item.allowCod,
                allowOnlinePayment: item.allowOnlinePayment,
                image: item.color.images?.[0]?.imageUrl ?? "/placeholder.png",
                options: [
                  {
                    optionName: "Color",
                    value: item.color.name,
                  },
                  {
                    optionName: item.variant?.optionName ?? "",
                    value: item.variant?.optionValue ?? "",
                  },
                ],
              }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}