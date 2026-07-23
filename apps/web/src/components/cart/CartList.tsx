"use client";

import CartEmpty from "./CartEmpty";
import CartItem from "./CartItem";

import { useCart } from "@/store/cart";

export default function CartList() {
  const items = useCart(
    (state) => state.items
  );

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.variantId}
          item={item}
        />
      ))}
    </div>
  );
}