"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useCart } from "@/store/cart";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

import SectionHeader from "../shared/SectionHeader";
import ContinueShoppingCard from "./ContinueShoppingCard";

export default function ContinueShopping() {
  const items = useCart((state) => state.items);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-10 sm:py-14 antialiased selection:bg-[#008744]/10 border-b border-gray-100 select-none">
      <Container className="max-w-none w-full px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          <SectionHeader
            title="Continue Shopping"
            description={`You have ${items.length} ${
              items.length === 1 ? "item" : "items"
            } waiting in your cart.`}
            action={
              <Button
                asChild
                variant="outline"
                className="rounded-full border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 hover:text-[#008744] cursor-pointer h-9 px-5 shadow-xs transition-all active:scale-95"
              >
                <Link href="/cart">
                  View Cart
                </Link>
              </Button>
            }
          />

          {/* Pinterest-Style Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full items-start">
            {items.map((item) => (
              <ContinueShoppingCard
                key={item.variantId}
                item={item}
              />
            ))}
          </div>

          {/* Checkout Action Button */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#008744] hover:bg-[#006e37] px-8 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-xs transition-all duration-200 active:scale-[0.98] cursor-pointer h-11 flex items-center justify-center gap-2"
            >
              <Link href="/checkout">
                <span>Continue to Checkout</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          
        </div>
      </Container>
    </section>
  );
}