"use client";

import { useCart } from "@/store/cart";

export default function CartHeader() {
  const items = useCart((state) => state.items);

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 border-b border-gray-100 pb-5 sm:pb-6 select-none antialiased">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-normal">
          Review your selected items and proceed to checkout
        </p>
      </div>

      <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0">
        {totalItems} {totalItems === 1 ? "Item" : "Items"}
      </div>
    </div>
  );
}