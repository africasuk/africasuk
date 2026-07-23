"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CartItem } from "@/types/cart";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Price } from "../currency/Price";

interface Props {
  item: CartItem;
}

export default function ContinueShoppingCard({ item }: Props) {
  return (
    <Card className="group relative flex h-full w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:border-[#002b15]/20 hover:shadow-lg antialiased select-none">
      
      {/* 1. Full Image Showcase Frame */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-xl bg-gray-50">
        <Link href={`/products/${item.slug}`} className="relative block h-full w-full">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>
      </div>

      {/* 2. Responsive Content & Actions */}
      <div className="flex min-w-0 flex-1 flex-col justify-between pt-3.5 px-1 space-y-3">
        
        {/* Title and Variant Badges */}
        <div className="min-w-0 space-y-2">
          <Link href={`/products/${item.slug}`} className="group/title block">
            <h3 className="line-clamp-1 text-xs sm:text-sm font-bold text-gray-900 transition-colors duration-200 group-hover/title:text-[#002b15]">
              {item.name}
            </h3>
          </Link>

          {/* Color/Size Options Pills */}
          {item.options && item.options.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.options.map((option) => (
                <span
                  key={`${option.optionName}-${option.value}`}
                  className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                >
                  {option.optionName}: {option.value}
                </span>
              ))}
            </div>
          )}

          {/* Breakdown Summary Box */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50/80 p-2.5 border border-gray-100 gap-2 min-w-0">
            <div>
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                Quantity
              </p>
              <p className="text-xs sm:text-sm font-extrabold text-gray-800 mt-1 leading-none">
                ×{item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">
                Total
              </p>
              <div className="mt-1 text-sm sm:text-base font-black tracking-tight text-[#002b15]">
                <Price price={item.price * item.quantity} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="min-w-0 pt-0.5">
          <Button
            asChild
            size="sm"
            className="h-9 w-full rounded-full bg-[#002b15] text-xs font-bold text-white transition-all duration-200 hover:bg-[#002b15]/90 active:scale-[0.98] cursor-pointer shadow-xs px-3 flex items-center justify-center min-w-0"
          >
            <Link href="/checkout">
              <span className="truncate">Continue Checkout</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
            </Link>
          </Button>
        </div>

      </div>
    </Card>
  );
}