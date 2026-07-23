"use client";

import WishlistEmpty from "./WishlistEmpty";
import WishlistItem from "./WishlistItem";

import { useWishlist } from "@/store/wishlist";

export default function WishlistList() {
  const items = useWishlist(
    (state) => state.items
  );

  if (items.length === 0) {
    return <WishlistEmpty />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <WishlistItem
          key={item.variantId}
          item={item}
        />
      ))}
    </div>
  );
}