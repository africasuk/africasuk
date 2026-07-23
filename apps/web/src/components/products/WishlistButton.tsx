"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import type { WishlistItem } from "@africasuk/types";
import { Button } from "@/components/ui/button";
import { cn } from "lib/utils";

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
        "h-11 w-11 rounded-lg border border-gray-200 bg-white hover:border-[#002b15]/20 hover:bg-[#002b15]/5 active:scale-[0.98] transition-all duration-200 shrink-0",
        active && "border-rose-200 bg-rose-50/50 hover:bg-rose-100/50",
        className
      )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-colors duration-200",
          active
            ? "fill-rose-500 text-rose-500"
            : "text-gray-500 hover:text-[#002b15]"
        )}
      />
    </Button>
  );
}