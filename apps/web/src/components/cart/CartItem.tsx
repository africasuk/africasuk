"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";

interface Props {
  item: CartItem;
}

export default function CartItem({ item }: Props) {
  const removeItem = useCart((state) => state.removeItem);
  const increaseQuantity = useCart((state) => state.increaseQuantity);
  const decreaseQuantity = useCart((state) => state.decreaseQuantity);

  function increase() {
    increaseQuantity(item.variantId);
  }

  function decrease() {
    decreaseQuantity(item.variantId);
  }

  return (
    <div className="flex gap-3 sm:gap-4 rounded-none border border-gray-200 bg-white p-3 sm:p-4 select-none antialiased shadow-none transition-colors duration-150">
      {/* Product Image */}
      <Link href={`/products/${item.slug}`} className="shrink-0">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-none border border-gray-100 bg-gray-50">
          <Image
            src={item.image || "/placeholder.png"}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-cover transition-transform duration-300 hover:scale-102"
          />
        </div>
      </Link>

      {/* Product Information & Controls */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <Link href={`/products/${item.slug}`} className="group">
            <h3 className="text-xs sm:text-sm font-medium tracking-tight text-gray-900 group-hover:text-[#004d26] transition-colors line-clamp-1">
              {item.name}
            </h3>
          </Link>

          {/* Variants / Options */}
          {item.options.length > 0 && (
            <div className="mt-1.5 space-y-0.5 text-[11px] sm:text-xs">
              {item.options.map((option) => (
                <div
                  key={`${option.optionName}-${option.value}`}
                  className="flex items-center gap-1.5 text-gray-500 font-normal"
                >
                  <span className="text-gray-400">{option.optionName}:</span>
                  <span className="font-medium text-gray-700">{option.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quantity Controls & Price */}
        <div className="mt-3 flex items-end justify-between gap-2 pt-2 border-t border-gray-100">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-none border border-gray-200 bg-white h-7 sm:h-8">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={decrease}
              disabled={item.quantity <= 1}
              className="h-full w-7 sm:w-8 rounded-none text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent p-0 flex items-center justify-center cursor-pointer transition-colors shadow-none"
            >
              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>

            <span className="w-8 sm:w-9 text-center text-xs sm:text-sm font-medium text-gray-900 border-x border-gray-100 h-full flex items-center justify-center">
              {item.quantity}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={increase}
              disabled={item.quantity >= item.stock}
              className="h-full w-7 sm:w-8 rounded-none text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent p-0 flex items-center justify-center cursor-pointer transition-colors shadow-none"
            >
              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Button>
          </div>

          {/* Price & Remove Action */}
          <div className="flex items-center gap-3">
            <div className="text-xs sm:text-sm font-semibold text-[#004d26]">
              <Price price={item.price * item.quantity} />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(item.variantId)}
              className="h-auto p-1 text-gray-400 hover:text-red-600 hover:bg-transparent rounded-none transition-colors cursor-pointer"
              title="Remove item"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}