"use client";

import { ShoppingCart } from "lucide-react";

import { useCart } from "@/store/cart";

export default function CartHeader() {
  const items = useCart(
    (state) => state.items
  );

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="border-b pb-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="h-8 w-8 text-primary" />

        <div>
          <h1 className="text-3xl font-bold">
            Shopping Cart
          </h1>

          <p className="text-muted-foreground">
            {totalItems}{" "}
            {totalItems === 1
              ? "item"
              : "items"}{" "}
            in your cart
          </p>
        </div>
      </div>
    </div>
  );
}