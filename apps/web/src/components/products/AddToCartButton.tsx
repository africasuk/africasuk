"use client";

import { ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/store/cart";
import type { CartItem } from "@/types/cart";

interface Props {
  item: CartItem;
}

export function AddToCartButton({ item }: Props) {
  const addItem = useCart((state) => state.addItem);
  const buyNow = useCart((state) => state.buyNow);
  const quantity = useCart((state) => state.getQuantity(item.variantId));

  const isOutOfStock = item.stock <= 0;

  return (
    <div className="flex w-full select-none items-center gap-2.5 antialiased">
      {/* Primary Add To Cart Button */}
      <button
        type="button"
        onClick={() => addItem(item)}
        disabled={isOutOfStock}
        className="group relative flex h-11 grow cursor-pointer items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 text-xs font-semibold tracking-wide text-white transition-all active:scale-[0.985] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 disabled:shadow-none"
      >
        <ShoppingBag className="h-4 w-4 stroke-2" />
        <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>

        {quantity > 0 && (
          <span className="ml-0.5 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold leading-none text-white">
            {quantity}
          </span>
        )}
      </button>

      {/* Buy Now Secondary Action */}
      <button
        type="button"
        onClick={() => {
          buyNow(item);
          window.location.href = "/checkout";
        }}
        disabled={isOutOfStock}
        className="flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-5 text-xs font-semibold tracking-wide text-zinc-900 transition-all active:scale-[0.985] hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-100 disabled:text-zinc-400"
      >
        <Zap className="h-3.5 w-3.5 fill-zinc-900 text-zinc-900 group-disabled:fill-zinc-400" />
        <span>Buy Now</span>
      </button>
    </div>
  );
}