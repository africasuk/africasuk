"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import type { CartItem } from "@/types/cart";

import { Button } from "@/components/ui/button";
import { Price } from "@/components/currency/Price";

import { useCart } from "@/store/cart";

interface Props {
  item: CartItem;
}

export default function CartItem({
  item,
}: Props) {
  const removeItem =
    useCart(
      (state) => state.removeItem,
    );

  const increaseQuantity =
    useCart(
      (state) =>
        state.increaseQuantity,
    );

  const decreaseQuantity =
    useCart(
      (state) =>
        state.decreaseQuantity,
    );

  function increase() {
    increaseQuantity(
      item.variantId,
    );
  }

  function decrease() {
    decreaseQuantity(
      item.variantId,
    );
  }

  return (
    <div className="flex gap-4 rounded-xl border p-4">
      <Link
        href={`/products/${item.slug}`}
      >
        <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-muted">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.slug}`}
          >
            <h3 className="font-semibold hover:text-primary">
              {item.name}
            </h3>
          </Link>

          {item.options.length >
            0 && (
            <div className="mt-3 space-y-1">
              {item.options.map(
                (
                  option,
                ) => (
                  <div
                    key={`${option.optionName}-${option.value}`}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="min-w-20 font-medium text-muted-foreground">
                      {
                        option.optionName
                      }
                    </span>

                    <span className="text-foreground">
                      {
                        option.value
                      }
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center rounded-lg border">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={
                decrease
              }
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="w-10 text-center font-medium">
              {item.quantity}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={
                increase
              }
              disabled={
                item.quantity >=
                item.stock
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold">
              <Price
                price={
                  item.price *
                  item.quantity
                }
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() =>
                removeItem(
                  item.variantId,
                )
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}