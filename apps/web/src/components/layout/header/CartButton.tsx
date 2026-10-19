"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/store/cart";
import { useHydrated } from "hooks/useHydrated";

interface CartButtonProps {
  showLabel?: boolean;
  className?: string;
}

export default function CartButton({
  showLabel = true,
  className = "",
}: CartButtonProps) {
  const hydrated = useHydrated();
  const totalItems = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const hasItems = hydrated && totalItems > 0;

  return (
    <Link
      href="/cart"
      aria-label="Shopping Cart"
      className={[
        "group relative flex items-center justify-center transition-all duration-200 active:scale-95",
        showLabel
          ? "flex-col gap-1 rounded-lg px-2 py-1.5 text-neutral-600 hover:bg-neutral-50 hover:text-[#004d26]"
          : "h-9 w-9 rounded-full text-inherit hover:opacity-80",
        className,
      ].join(" ")}
    >
      <div className="relative flex items-center justify-center">
        <ShoppingBag
          className={[
            "h-5 w-5 transition-transform group-hover:scale-105",
            hasItems ? "fill-current" : "fill-transparent stroke-[1.8]",
          ].join(" ")}
        />

        {hasItems && (
          <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-white bg-neutral-900 px-1 text-[9px] font-bold text-white shadow-xs pointer-events-none animate-in fade-in zoom-in-75 duration-200">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </div>

      {showLabel && (
        <span className="text-[10px] font-medium tracking-wide transition-colors group-hover:text-[#004d26]">
          Cart
        </span>
      )}
    </Link>
  );
}