"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

import type { CartItem } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Price } from "../currency/Price";

interface Props {
  item: CartItem;
}

export default function ContinueShoppingCard({ item }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div
      className={`group flex w-full flex-col select-none antialiased transition-all duration-300 ${
        isLoading ? "pointer-events-none opacity-80" : ""
      }`}
    >
      {/* 1. Pinterest-Style 1:1 Aspect Ratio Image Card */}
      <Link
        href={`/products/${item.slug}`}
        onClick={() => setIsLoading(true)}
        className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100/80 shadow-xs transition-transform duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-md"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={80}
          className="object-cover"
        />

        {/* Loading Spinner Feedback */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-xs">
            <Loader2 className="h-6 w-6 animate-spin text-[#008744]" />
          </div>
        )}

        {/* Floating Quantity Indicator */}
        <div className="absolute top-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-gray-800 shadow-xs border border-gray-100">
          ×{item.quantity}
        </div>
      </Link>

      {/* 2. Content & Details Underneath */}
      <div className="flex flex-col pt-3 px-1 space-y-2">
        <Link
          href={`/products/${item.slug}`}
          onClick={() => setIsLoading(true)}
          className="block"
        >
          <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 transition-colors group-hover:text-[#008744]">
            {item.name}
          </h3>
        </Link>

        {/* Rounded Option Pills */}
        {item.options && item.options.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.options.map((option) => (
              <span
                key={`${option.optionName}-${option.value}`}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
              >
                {option.optionName}: {option.value}
              </span>
            ))}
          </div>
        )}

        {/* Price Row */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="text-sm font-bold text-gray-900 tracking-tight">
            <Price price={item.price * item.quantity} />
          </div>
        </div>

        {/* Rounded Action Button */}
        <div className="pt-1">
          <Button
            asChild
            size="sm"
            className="h-9 w-full rounded-full bg-[#008744] text-xs font-semibold text-white transition-all duration-200 hover:bg-[#006e37] active:scale-[0.98] cursor-pointer shadow-xs"
          >
            <Link href="/checkout" onClick={() => setIsLoading(true)}>
              <span>{isLoading ? "Loading..." : "Continue Checkout"}</span>
              {isLoading ? (
                <Loader2 className="ml-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              )}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}