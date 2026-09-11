"use client";

import { ShieldCheck } from "lucide-react";

export default function CheckoutHeader() {
  return (
    <div className="border-b border-neutral-200/60 pb-5 antialiased select-none sm:pb-6">
      <div className="flex flex-row items-center gap-3 sm:gap-4">
        {/* Checkout Icon */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#004d26]/10 bg-[#004d26]/5 text-[#004d26] sm:h-12 sm:w-12">
          <ShieldCheck className="h-5 w-5 stroke-[2.5] sm:h-6 sm:w-6" />
        </div>

        {/* Header */}
        <div className="min-w-0">
          <h1 className="text-xl font-black leading-tight tracking-tight text-neutral-900 sm:text-2xl md:text-3xl">
            Checkout
          </h1>

          <p className="mt-0.5 text-xs font-medium text-neutral-500 sm:mt-1 sm:text-sm">
            Review your order and complete your purchase.
          </p>
        </div>
      </div>
    </div>
  );
}