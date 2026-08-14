"use client";

import Link from "next/link";

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
    <section className="bg-gray-50/70 py-10 lg:py-14 antialiased selection:bg-[#004d26]/10 border-b border-gray-100 select-none">
      <Container>
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
                className="rounded-none border-gray-300 text-xs font-semibold text-gray-800 bg-white shadow-none hover:bg-gray-100 hover:border-gray-400 cursor-pointer h-9 px-4 flex items-center justify-center"
              >
                <Link href="/cart">
                  View Cart
                </Link>
              </Button>
            }
          />

          {/* Responsive Item Grid */}
          <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3 sm:gap-5 w-full justify-center">
            {items.map((item) => (
              <ContinueShoppingCard
                key={item.variantId}
                item={item}
              />
            ))}
          </div>

          {/* Checkout Action Button */}
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-none bg-[#004d26] px-8 text-xs sm:text-sm font-semibold tracking-wide text-white shadow-none transition-colors duration-200 hover:bg-[#00361a] active:scale-[0.99] cursor-pointer h-10 sm:h-11 flex items-center justify-center"
            >
              <Link href="/checkout">
                Continue to Checkout
              </Link>
            </Button>
          </div>
          
        </div>
      </Container>
    </section>
  );
}