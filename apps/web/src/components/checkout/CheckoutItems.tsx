"use client";

import Image from "next/image";
import Link from "next/link";

import { Price } from "@/components/currency/Price";

import { useCart } from "@/store/cart";

export default function CheckoutItems() {
  const items = useCart(
    (state) => state.items,
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl border p-10 text-center">
        <h2 className="text-xl font-semibold">
          Your cart is empty
        </h2>

        <p className="mt-2 text-muted-foreground">
          Add products before checkout.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex text-primary hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border">
      {items.map((item) => (
        <div
          key={item.variantId}
          className="flex gap-4 border-b p-5 last:border-b-0"
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

          <div className="flex flex-1 justify-between">
            <div>
              <h3 className="font-semibold">
                {item.name}
              </h3>

              {item.options.length >
                0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.options.map(
                    (option) => (
                      <span
                        key={`${option.optionName}-${option.value}`}
                        className="rounded-md bg-muted px-2 py-1 text-xs"
                      >
                        {option.optionName}:{" "}
                        {option.value}
                      </span>
                    ),
                  )}
                </div>
              )}
            </div>

            <div className="text-right">
              <p className="font-semibold">
                Qty: {item.quantity}
              </p>

              <div className="mt-2 text-lg font-bold">
                <Price
                  price={
                    item.price *
                    item.quantity
                  }
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}