"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Price } from "@/components/currency/Price";

import { useCart } from "@/store/cart";

export default function CartSummary() {
  const items = useCart(
    (state) => state.items,
  );

  const subtotal = items.reduce(
    (total: number, item) =>
      total +
      Number(item.price) *
        Number(item.quantity),
    0,
  );

  const shipping = 0;

  const total =
    subtotal + shipping;

  return (
    <Card className="sticky top-24 h-fit rounded-2xl p-6">
      <h2 className="mb-6 text-xl font-semibold">
        Order Summary
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>

          <div className="font-medium">
            <Price
              price={subtotal}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>

          <span>Free</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>

            <div>
              <Price
                price={total}
              />
            </div>
          </div>
        </div>

        <Button
          asChild
          className="mt-6 w-full"
          disabled={
            items.length === 0
          }
        >
          <Link href="/checkout">
            Proceed to Checkout
          </Link>
        </Button>
      </div>
    </Card>
  );
}