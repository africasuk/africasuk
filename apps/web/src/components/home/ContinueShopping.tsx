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
    <section className="bg-[#f4f4f4] py-12 lg:py-16 antialiased selection:bg-[#004d26]/10">
      <Container>
        {/* Max-Width Wrapper for beautiful alignment */}
        <div className="max-w-7xl mx-auto space-y-8">
          
          <SectionHeader
            title="Continue Shopping"
            description={`You have ${items.length} ${
              items.length === 1 ? "item" : "items"
            } waiting in your cart.`}
            action={
              <Button
                asChild
                variant="outline"
                className="rounded-full border-neutral-300 text-xs font-bold text-neutral-700 bg-white shadow-xs hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer h-9 px-4 flex items-center justify-center"
              >
                <Link href="/cart">
                  View Cart
                </Link>
              </Button>
            }
          />

          {/* 
            Responsive Layout Guard:
            - Renders exactly 2 side-by-side columns on mobile phones.
            - Utilizes an auto-fill fluid track on desktops so grid cells never get squished.
          */}
          <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3 sm:gap-6 w-full justify-center">
            {items.map((item) => (
              <ContinueShoppingCard
                key={item.variantId}
                item={item}
              />
            ))}
          </div>

          {/* Checkout Redirection Center Piece */}
          <div className="mt-10 flex justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-[#004d26] px-8 text-xs sm:text-sm font-bold tracking-wide text-white shadow-sm transition-colors duration-200 hover:bg-[#003b1d] active:scale-[0.98] cursor-pointer h-10 sm:h-11 flex items-center justify-center"
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