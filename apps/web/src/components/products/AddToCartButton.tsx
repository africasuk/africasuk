"use client";

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
    <div className="flex items-center gap-3 w-full">
      {/* Primary Add To Cart Button - Updated to canonical bg-linear-to-r */}
      <button
        onClick={() => addItem(item)}
        disabled={isOutOfStock}
        className="grow h-11 px-6 bg-linear-to-r from-[#002b15] via-[#004d26] to-[#005c2e] hover:from-[#001f0f] hover:to-[#004a25] active:scale-[0.99] text-white text-xs font-semibold tracking-wider uppercase rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        <span>ADD TO CART</span>
        {quantity > 0 && (
          <span className="bg-emerald-300/90 text-[#002b15] px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
            {quantity}
          </span>
        )}
      </button>

      {/* Bordered Buy Now Button - Updated to canonical hover:bg-linear-to-r */}
      <button
        onClick={() => {
          buyNow(item);
          window.location.href = "/checkout";
        }}
        disabled={isOutOfStock}
        className="h-11 px-6 border border-[#005c2e]/30 text-[#004d26] hover:bg-linear-to-r hover:from-[#002b15]/5 hover:to-[#005c2e]/10 active:scale-[0.99] text-xs font-semibold tracking-wider uppercase rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        BUY NOW
      </button>
    </div>
  );
}