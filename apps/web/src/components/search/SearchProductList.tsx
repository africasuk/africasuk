'use client';

import Image from "next/image";
import Link from "next/link";
import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "@/components/currency/Price";
import { Badge } from "@/components/ui/badge";
import AddSearchCartButton from "./AddSearchCartButton";
import { WishlistButton } from "../products/WishlistButton";
import { Star } from "lucide-react";

interface Props {
  products: ProductWithDetails[];
}

export default function SearchProductList({
  products,
}: Props) {
  const items = products.flatMap((product) =>
    product.colors.map((color) => ({
      ...product,
      color,
      variant: color.variants[0],
      id: `${product.id}-${color.id}`,
    }))
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item) => {
        // Safe extraction handling both nested object (`item.rating.averageRating`) and primitive (`item.rating`) structures
        const rawRating = item.rating;
        const averageRating = Number(
          typeof rawRating === "object" && rawRating !== null
            ? rawRating.averageRating ?? 0
            : rawRating ?? 0
        );

        const reviewCount = Number(
          typeof rawRating === "object" && rawRating !== null
            ? rawRating.reviewCount ?? 0
            : (item as unknown as { review_count?: number }).review_count ?? 0
        );

        return (
          <Link
            key={item.id}
            href={`/products/${item.slug}?color=${item.color.id}`}
            className="group relative flex flex-col sm:flex-row gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-border bg-card p-3 sm:p-4 text-card-foreground shadow-2xs transition-all duration-200 hover:bg-muted/40 hover:shadow-md"
          >
            {/* Main Content Area: Image + Details */}
            <div className="flex flex-1 items-start gap-3 sm:gap-4 min-w-0">
              {/* Image Container */}
              <div className="relative h-20 w-20 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-lg sm:rounded-xl border border-border/80 bg-muted/50">
                <Image
                  src={
                    item.color.images?.[0]?.imageUrl ??
                    "/placeholder.png"
                  }
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 80px, 112px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0 space-y-1 sm:space-y-1.5">
                <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground group-hover:text-[#005c2e] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {item.name} - {item.color.name}
                </h2>

                {/* Rating UI */}
                <div className="flex items-center gap-1.5">
                  {reviewCount > 0 ? (
                    <>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={`h-3 w-3 ${
                              index < Math.round(averageRating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted text-muted/60"
                            }`}
                          />
                        ))}
                      </div>

                      <span className="text-xs font-semibold text-muted-foreground">
                        {averageRating.toFixed(1)}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        ({reviewCount})
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No reviews yet
                    </span>
                  )}
                </div>

                {/* Brand & Category */}
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {item.brand && (
                    <span>
                      Brand:{" "}
                      <strong className="font-medium text-foreground">
                        {item.brand.name}
                      </strong>
                    </span>
                  )}
                  {item.category && (
                    <span>
                      Category:{" "}
                      <strong className="font-medium text-foreground">
                        {item.category.name}
                      </strong>
                    </span>
                  )}
                </div>

                {/* Variant & Stock Badges */}
                {item.variant && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <Badge
                      variant="secondary"
                      className="px-2 py-0.5 text-[10px] sm:text-xs font-medium"
                    >
                      {item.variant.optionName}: {item.variant.optionValue}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-emerald-900 "
                    >
                      Stock: {item.variant.stock}
                    </Badge>
                  </div>
                )}

                {/* Description */}
                {item.description && (
                  <p className="hidden sm:block text-xs text-muted-foreground line-clamp-2 pt-0.5">
                    {item.description}
                  </p>
                )}

                {/* Price Display */}
                <div className="pt-1">
                  <Price
                    price={item.variant?.price ?? 0}
                    className="text-base sm:text-lg font-black text-[#005c2e] dark:text-emerald-900"
                  />
                </div>
              </div>
            </div>

            {/* Actions Container: Wishlist + Add to Cart */}
            <div
              className="flex items-center justify-end gap-2 border-t border-border/80 pt-2.5 sm:border-t-0 sm:pt-0 shrink-0"
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
                  image:
                    item.color.images?.[0]?.imageUrl ??
                    "/placeholder.png",
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
                    item.color.images?.[0]?.imageUrl ??
                    "/placeholder.png",
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
        );
      })}
    </div>
  );
}