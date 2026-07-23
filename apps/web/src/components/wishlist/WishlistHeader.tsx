"use client";

import { Heart } from "lucide-react";

import { useWishlist } from "@/store/wishlist";

export default function WishlistHeader() {
  const totalItems = useWishlist(
    (state) => state.items.length
  );

  return (
    <div className="border-b pb-6">
      <div className="flex items-center gap-3">
        <Heart className="h-8 w-8 text-red-500 fill-red-500" />

        <div>
          <h1 className="text-3xl font-bold">
            My Wishlist
          </h1>

          <p className="text-muted-foreground">
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            saved
          </p>
        </div>
      </div>
    </div>
  );
}