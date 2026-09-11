"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCard, Truck } from "lucide-react";
import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "@/components/currency/Price";
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
    <div className="space-y-3 select-none antialiased">
      {items.map((item) => {
        const inStock = (item.variant?.stock ?? 0) > 0;
        const availableSizes = (item.color.variants || []).map(
          (v) => v.optionValue
        );

        return (
          <Link
            key={item.id}
            href={`/products/${item.slug}?color=${item.color.id}`}
            className="group relative flex flex-row items-center gap-3 rounded-2xl border border-zinc-200/90 bg-white p-3 transition-all duration-150 hover:border-zinc-300 hover:shadow-xs sm:gap-5 sm:p-4"
          >
            {/* Fixed 1:1 Square Image Container on all screen sizes */}
            <div className="relative aspect-square h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-zinc-150 bg-zinc-50/80 sm:h-36 sm:w-36 md:h-40 md:w-40">
              <Image
                src={item.color.images?.[0]?.imageUrl ?? "/placeholder.png"}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 160px"
                className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Product Meta & Actions */}
            <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
              <div className="space-y-1">
                {/* Brand & Stock Status Header */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs">
                  {item.brand && (
                    <span className="font-semibold text-zinc-900">
                      {item.brand.name}
                    </span>
                  )}
                  {item.brand && item.category && (
                    <span className="text-zinc-300">•</span>
                  )}
                  {item.category && (
                    <span className="text-zinc-500">{item.category.name}</span>
                  )}

                  <span className="text-zinc-300">•</span>

                  {/* Swatch indicator */}
                  <div className="inline-flex items-center gap-1">
                    <span
                      className="h-2 w-2 rounded-full border border-black/10"
                      style={{
                        backgroundColor: item.color.hexCode ?? "#e4e4e7",
                      }}
                    />
                    <span className="capitalize text-zinc-600">
                      {item.color.name}
                    </span>
                  </div>

                  <span className="text-zinc-300">•</span>

                  {/* Stock pill */}
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.2 text-[9px] font-semibold sm:text-[10px] ${
                      inStock
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                    }`}
                  >
                    <span
                      className={`h-1 w-1 rounded-full ${
                        inStock ? "bg-emerald-500" : "bg-zinc-400"
                      }`}
                    />
                    {inStock ? "In Stock" : "Sold Out"}
                  </span>
                </div>

                {/* Title */}
                <h2 className="line-clamp-1 text-xs font-bold tracking-tight text-zinc-900 group-hover:text-zinc-700 sm:text-base">
                  {item.name}
                </h2>

                {/* Sizes Row */}
                {availableSizes.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    <span className="text-[10px] font-medium text-zinc-400 sm:text-[11px]">
                      Sizes:
                    </span>
                    {availableSizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.2 text-[9px] font-semibold text-zinc-700 sm:text-[10px]"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                )}

                {/* Delivery Badges */}
                <div className="hidden flex-wrap items-center gap-1.5 pt-0.5 sm:flex">
                  {item.allowCod && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200/80 bg-zinc-50 px-1.5 py-0.5 text-[9px] font-medium text-zinc-600 sm:text-[10px]">
                      <Truck className="h-3 w-3 text-zinc-500" strokeWidth={2} />
                      COD
                    </span>
                  )}
                  {item.allowOnlinePayment && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-zinc-200/80 bg-zinc-50 px-1.5 py-0.5 text-[9px] font-medium text-zinc-600 sm:text-[10px]">
                      <CreditCard
                        className="h-3 w-3 text-zinc-500"
                        strokeWidth={2}
                      />
                      Card
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Row: Price & Action Triggers */}
              <div
                className="mt-1 flex items-center justify-between gap-2 pt-1 border-t border-zinc-100/80"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div>
                  <div className="text-sm font-bold tracking-tight text-zinc-900 sm:text-lg">
                    <Price price={item.variant?.price ?? 0} />
                  </div>
                  {inStock && item.variant?.stock && (
                    <span className="text-[9px] font-medium text-zinc-400 sm:text-[10px]">
                      {item.variant.stock} left
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <WishlistButton
                    className="h-8 w-8 rounded-lg sm:h-9 sm:w-9"
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
                      image:
                        item.color.images?.[0]?.imageUrl ?? "/placeholder.png",
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
                      image:
                        item.color.images?.[0]?.imageUrl ?? "/placeholder.png",
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
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}