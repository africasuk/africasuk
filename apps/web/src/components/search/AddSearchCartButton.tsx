"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CartItem } from "@/types/cart";

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
      className="relative h-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-zinc-900 px-4 text-xs font-semibold text-white transition-all active:scale-[0.985] hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
    >
      <ShoppingBag className="h-4 w-4 shrink-0" strokeWidth={1.8} />
      <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>

      {quantity > 0 && (
        <Badge
          variant="secondary"
          className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full border-0 bg-white/20 px-1 text-[10px] font-bold text-white"
        >
          {quantity}
        </Badge>
      )}
    </Button>
  );
}