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
        "h-10 w-10 rounded-none border border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 transition-colors duration-150 shrink-0 cursor-pointer shadow-none",
        active && "border-rose-200 bg-rose-50/60 hover:border-rose-300 hover:bg-rose-50",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 stroke-[1.5] transition-colors duration-150",
          active
            ? "fill-rose-500 text-rose-500"
            : "text-gray-500 hover:text-gray-900"
        )}
      />
    </Button>
  );
}