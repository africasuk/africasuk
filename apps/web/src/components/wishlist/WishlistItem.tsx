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
    <div className="group relative flex gap-3 sm:gap-5 rounded-2xl sm:rounded-3xl border border-gray-200/80 bg-white p-3 sm:p-5 shadow-xs hover:border-[#005c2e]/40 hover:shadow-md transition-all duration-200 antialiased select-none">
      
      {/* Compact Mobile Image Container */}
      <Link href={`/products/${item.slug}`} className="shrink-0">
        <div className="relative h-20 w-20 sm:h-32 sm:w-32 overflow-hidden rounded-xl sm:rounded-2xl bg-gray-50/80 border border-gray-100">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 80px, 128px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Item Information & Actions Stack */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="space-y-0.5 sm:space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/products/${item.slug}`} className="min-w-0">
              <h3 className="text-xs sm:text-lg font-black tracking-tight text-[#002b15] hover:text-[#005c2e] transition-colors line-clamp-1 sm:line-clamp-2">
                {item.name}
              </h3>
            </Link>

            {/* Quick Remove Button */}
            <button
              type="button"
              onClick={() => removeItem(item.variantId)}
              aria-label="Remove item from wishlist"
              className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg sm:rounded-xl transition-colors cursor-pointer shrink-0 -mr-1 -mt-0.5"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>

          <div className="text-xs sm:text-lg font-black text-[#002b15]">
            <Price price={item.price} />
          </div>
        </div>

        {/* Compact Mobile Action Buttons */}
        <div className="mt-2 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-gray-100/80">
          <Button
            onClick={() =>
              addItem({
                ...item,
                quantity: 1,
              })
            }
            className="h-8 sm:h-10 px-2.5 sm:px-4 rounded-lg sm:rounded-xl bg-[#002b15] hover:bg-[#004220] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-xs active:scale-98 cursor-pointer"
          >
            <ShoppingCart className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-white" />
            <span>Add to Cart</span>
          </Button>

          <Button
            variant="outline"
            asChild
            className="h-8 sm:h-10 px-2.5 sm:px-4 rounded-lg sm:rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-[#002b15] text-[10px] sm:text-xs font-black uppercase tracking-wider active:scale-98 cursor-pointer"
          >
            <Link href={`/products/${item.slug}`}>
              <span>View</span>
              <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-400" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}