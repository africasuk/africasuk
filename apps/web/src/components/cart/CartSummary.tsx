"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";

export default function CartSummary() {
  const items = useCart((state) => state.items);

  const subtotal = items.reduce(
    (total: number, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;
  const isDisabled = items.length === 0;

  return (
    <Card className="sticky top-20 sm:top-24 h-fit rounded-none border border-gray-200 bg-white p-4 sm:p-5 shadow-none select-none antialiased">
      <div className="border-b border-gray-100 pb-3 mb-4">
        <h2 className="text-sm sm:text-base font-semibold tracking-tight text-gray-900">
          Order Summary
        </h2>
      </div>

      <div className="space-y-3 text-xs sm:text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal</span>
          <div className="font-medium text-gray-900">
            <Price price={subtotal} />
          </div>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-medium text-[#004d26]">Free</span>
        </div>

        {/* Total */}
        <div className="border-t border-gray-100 pt-3.5 mt-3.5">
          <div className="flex items-center justify-between text-sm sm:text-base font-semibold text-gray-900">
            <span>Total</span>
            <div className="text-base sm:text-lg font-bold text-[#004d26] tracking-tight">
              <Price price={total} />
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="pt-2">
          {isDisabled ? (
            <Button
              disabled
              className="w-full rounded-none bg-gray-100 text-gray-400 font-medium text-xs sm:text-sm h-10 shadow-none cursor-not-allowed"
            >
              <span>Proceed to Checkout</span>
            </Button>
          ) : (
            <Button
              asChild
              className="w-full rounded-none bg-[#004d26] text-white hover:bg-[#00361a] font-medium text-xs sm:text-sm h-10 transition-colors shadow-none cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Link href="/checkout">
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}