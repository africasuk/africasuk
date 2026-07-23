"use client";

import { ShieldCheck } from "lucide-react";

export default function CheckoutHeader() {
  return (
    <div className="border-b border-neutral-200/60 pb-5 sm:pb-6 select-none antialiased">
      <div className="flex flex-row items-center gap-3 sm:gap-4">
        
        {/* Modernized Secure Shield Shield Capsule Icon Container */}
        <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-[#004d26]/5 border border-[#004d26]/10 text-[#004d26]">
          <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.5]" />
        </div>

        {/* Dynamic Premium Header Typography */}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-neutral-900 leading-tight">
            Secure Checkout
          </h1>

          <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-neutral-500 font-medium">
            Your data is protected. Complete your order securely.
          </p>
        </div>

      </div>
    </div>
  );
}