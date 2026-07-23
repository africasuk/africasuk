"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import type { WishlistItem as Item } from "@/types/wishlist";

import { Button } from "@/components/ui/button";

import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { Price } from "../currency/Price";

interface Props {
  item: Item;
}

export default function WishlistItem({
  item,
}: Props) {
  const removeItem =
    useWishlist(
      (state) =>
        state.removeItem
    );

  const addItem = useCart(
    (state) => state.addItem
  );

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

          <div className="mt-2 text-lg font-bold">
            <Price
              price={item.price}
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={() =>
              addItem({
                ...item,
                quantity: 1,
              })
            }
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              removeItem(
                item.variantId
              )
            }
          >
            <Heart className="mr-2 h-4 w-4 fill-current" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}