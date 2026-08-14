"use client";

import type { CartItem } from "@/types/cart";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

interface Props {
  item: CartItem;
}

export default function AddSearchCartButton({ item }: Props) {
  const addItem = useCart((state) => state.addItem);
  const cartItems = useCart((state) => state.items);

  const currentItem = cartItems.find(
    (cartItem) => cartItem.variantId === item.variantId
  );

  const quantity = currentItem?.quantity ?? 0;
  const isOutOfStock = item.stock <= 0;

  return (
    <Button
      type="button"
      size="sm"
      disabled={isOutOfStock}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isOutOfStock) {
          addItem(item);
        }
      }}
      className="relative rounded-none bg-[#004d26] text-white hover:bg-[#00361a] disabled:bg-gray-100 disabled:text-gray-400 font-medium text-xs px-2.5 sm:px-3.5 h-8 transition-colors shadow-none cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
    >
      <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
      <span>{isOutOfStock ? "Out of Stock" : "Add"}</span>

      {quantity > 0 && (
        <Badge
          variant="secondary"
          className="ml-1 h-4 min-w-4 rounded-none bg-white/20 px-1 text-[10px] font-medium text-white border-0 justify-center leading-none"
        >
          {quantity}
        </Badge>
      )}
    </Button>
  );
}