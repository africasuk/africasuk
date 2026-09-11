"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import type { WishlistItem } from "@africasuk/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  item: WishlistItem;
  className?: string;
}

export function WishlistButton({ item, className }: Props) {
  const toggleItem = useWishlist((state) => state.toggleItem);
  const active = useWishlist((state) => state.isWishlisted(item.variantId));

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(item);
      }}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "h-11 w-11 shrink-0 cursor-pointer rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-all duration-150 active:scale-95 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900",
        active &&
          "border-rose-200 bg-rose-50/70 text-rose-600 hover:border-rose-300 hover:bg-rose-100/70 hover:text-rose-700",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 stroke-2 transition-transform duration-150",
          active
            ? "scale-110 fill-rose-500 text-rose-500"
            : "text-zinc-600 group-hover:text-zinc-900"
        )}
      />
    </Button>
  );
}