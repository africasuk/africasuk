"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";

import type { WishlistItem as Item } from "@/types/wishlist";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { Price } from "../currency/Price";

interface Props {
  item: Item;
}

export default function WishlistItem({ item }: Props) {
  const removeItem = useWishlist((state) => state.removeItem);
  const addItem = useCart((state) => state.addItem);

  return (
    <div className="group relative flex gap-3 sm:gap-4 border border-gray-200 bg-white p-3 sm:p-4 transition-colors duration-150 antialiased select-none rounded-none shadow-none hover:border-gray-300">
      {/* Product Image Frame */}
      <Link href={`/products/${item.slug}`} className="shrink-0">
        <div className="relative h-20 w-20 sm:h-28 sm:w-28 overflow-hidden rounded-none bg-gray-50 border border-gray-200">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 80px, 112px"
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />
        </div>
      </Link>

      {/* Item Information & Actions Pane */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/products/${item.slug}`} className="min-w-0">
              <h3 className="text-xs sm:text-sm font-medium tracking-tight text-gray-900 hover:text-[#004d26] transition-colors line-clamp-1 sm:line-clamp-2">
                {item.name}
              </h3>
            </Link>

            {/* Remove Action */}
            <button
              type="button"
              onClick={() => removeItem(item.variantId)}
              aria-label="Remove item from wishlist"
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded-none transition-colors cursor-pointer shrink-0 -mr-1 -mt-0.5"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[1.5]" />
            </button>
          </div>

          <div className="text-xs sm:text-sm font-semibold text-gray-900">
            <Price price={item.price} />
          </div>
        </div>

        {/* Action Button Row */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-gray-100">
          <Button
            onClick={() =>
              addItem({
                ...item,
                quantity: 1,
              })
            }
            className="h-8 sm:h-8.5 px-3 sm:px-3.5 rounded-none bg-[#004d26] hover:bg-[#00361a] text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-wider shadow-none cursor-pointer transition-colors duration-150"
          >
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5 text-white stroke-[1.5]" />
            <span>Add to Cart</span>
          </Button>

          <Button
            variant="outline"
            asChild
            className="h-8 sm:h-8.5 px-3 sm:px-3.5 rounded-none border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider cursor-pointer shadow-none transition-colors duration-150"
          >
            <Link href={`/products/${item.slug}`}>
              <span>View</span>
              <ArrowRight className="ml-1 h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400 stroke-[1.5]" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}