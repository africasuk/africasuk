"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "hooks/useHydrated";

export default function WishlistButton() {
  const hydrated = useHydrated();

  const totalItems = useWishlist(
    (state) => state.items.length
  );


  return (
    <Link
      href="/wishlist"
      className="group flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:text-[#004d26] active:scale-95"
      aria-label="Wishlist"
    >
      <div className="relative">

        <Heart
          className="h-5 w-5 transition-transform group-hover:scale-105"
        />


        {hydrated && totalItems > 0 && (
          <span
            className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border border-white bg-[#004d26] px-1 text-[9px] font-bold text-white shadow-sm animate-in fade-in zoom-in-75 duration-200 pointer-events-none"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}

      </div>


      <span className="text-[10px] font-medium tracking-wide transition-colors group-hover:text-[#004d26]">
        Wishlist
      </span>

    </Link>
  );
}