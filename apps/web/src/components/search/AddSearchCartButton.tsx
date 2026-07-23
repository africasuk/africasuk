"use client";

import type { CartItem } from "@/types/cart";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

interface Props {
  item: CartItem;
}

export default function AddSearchCartButton({
  item,
}: Props) {
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
      className="relative rounded-full bg-[#004d26] text-white hover:bg-[#003b1d] dark:bg-[#004d26] dark:hover:bg-[#003b1d] font-medium text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9 transition-all active:scale-95 shadow-xs"
    >
      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 shrink-0" />
      <span>{isOutOfStock ? "Out of Stock" : "Add"}</span>

      {quantity > 0 && (
        <Badge
          variant="secondary"
          className="ml-1.5 h-5 min-w-5 rounded-full bg-white/20 px-1.5 text-[10px] font-bold text-white border-0 justify-center"
        >
          {quantity}
        </Badge>
      )}
    </Button>
  );
}