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
    <div className="flex items-center gap-2.5 w-full select-none antialiased">
      {/* Primary Add To Cart Button with Brand Gradient */}
      <button
        type="button"
        onClick={() => addItem(item)}
        disabled={isOutOfStock}
        className="grow h-10 px-5 bg-linear-to-r from-[#002b15] via-[#004d26] to-[#005c2e] hover:from-[#001f0f] hover:to-[#003d1e] text-white text-xs font-medium uppercase tracking-wider rounded-none transition-all duration-200 flex items-center justify-center gap-2 shadow-none cursor-pointer disabled:bg-none disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
        {quantity > 0 && (
          <span className="bg-white/20 text-white px-1.5 py-0.5 rounded-none text-[10px] font-normal leading-none">
            {quantity}
          </span>
        )}
      </button>

      {/* Buy Now Button with Subtle Hover Gradient */}
      <button
        type="button"
        onClick={() => {
          buyNow(item);
          window.location.href = "/checkout";
        }}
        disabled={isOutOfStock}
        className="h-10 px-5 border border-[#004d26]/30 text-[#004d26] hover:bg-linear-to-r hover:from-[#002b15]/5 hover:to-[#005c2e]/10 text-xs font-medium uppercase tracking-wider rounded-none transition-all duration-200 shadow-none cursor-pointer disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        Buy Now
      </button>
    </div>
  );
}