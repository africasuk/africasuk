"use client";

import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import Logo from "@/components/layout/Logo";

export function RequestProductSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-16 text-gray-900 antialiased select-none sm:py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Content */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <span className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#008744] sm:text-xs">
              Looking for Something Specific?
            </span>

            <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Can&apos;t find it?
              <br className="hidden sm:inline" />
              <span className="text-[#008744]"> Just ask us.</span>
            </h2>

            <div className="mt-8 grid grid-cols-1 items-center gap-6 sm:mt-10 sm:grid-cols-12">
              {/* CTA */}
              <div className="flex items-center sm:col-span-5">
                <Link
                  href="/request-product"
                  className="group inline-flex items-center gap-3 rounded-full bg-gray-950 px-6 py-3.5 text-xs font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#008744] hover:shadow-lg hover:shadow-[#008744]/20 active:scale-95 sm:text-sm"
                >
                  <Camera className="h-4 w-4 text-white/80 transition-colors group-hover:text-white" />

                  <span>Request a Product</span>

                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                </Link>
              </div>

              {/* Description */}
              <div className="sm:col-span-7">
                <p className="max-w-sm text-xs leading-relaxed text-gray-600 sm:text-sm">
                  Send us a photo, product name, or link. If the product is
                  available from our suppliers, we&apos;ll help you find it
                  and arrange the purchase.
                </p>
              </div>
            </div>
          </div>

          {/* Right Logo */}
          <div className="relative flex items-center justify-center py-6 lg:col-span-5">
            <div className="relative flex w-full items-center justify-center">
              <div className="scale-[1.8] transition-transform duration-500 hover:scale-[1.9] sm:scale-[2.3] sm:hover:scale-[2.4] lg:scale-[2.6] lg:hover:scale-[2.7]">
                <Logo />
              </div>

              {/* Index Indicator */}
              <div className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1.5 font-mono text-[10px] tracking-widest text-gray-400">
                <span>01</span>
                <span className="h-10 w-px bg-gray-300" />
                <span>02</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}