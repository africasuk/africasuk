"use client";

import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import Logo from "@/components/layout/Logo";

export function RequestProductSection() {
  return (
    <section className="relative w-full overflow-hidden  text-gray-900  0 py-16 sm:py-24 lg:py-32 select-none antialiased">


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#008744] mb-3">
              Can&apos;t Find What You Need?
            </span>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-950 leading-[1.08]">
              Can&apos;t find it?
              <br className="hidden sm:inline" />
              <span className="text-[#008744]"> Just ask us.</span>
            </h2>

            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">

              {/* CTA */}
              <div className="sm:col-span-5 flex items-center">
                <Link
                  href="/request-product"
                  className="group inline-flex items-center gap-3 bg-gray-950 hover:bg-[#008744] text-white px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-[#008744]/20 active:scale-95"
                >
                  <Camera className="w-4 h-4 text-white/80 group-hover:text-white" />

                  <span>Request a Product</span>

                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </Link>
              </div>

              {/* Description */}
              <div className="sm:col-span-7">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
                  Take a photo of the product or send us a link. We&apos;ll
                  help you find it and arrange the purchase for you.
                </p>
              </div>
            </div>
          </div>

          {/* Right Logo */}
          <div className="lg:col-span-5 flex items-center justify-center relative py-6">
            <div className="relative w-full flex items-center justify-center">

              {/* Logo */}
              <div className="scale-[1.8] sm:scale-[2.3] lg:scale-[2.6] transition-transform duration-500 hover:scale-[2.7]">
                <Logo />
              </div>

              {/* Index Indicator */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 text-[10px] text-gray-400 font-mono tracking-widest">
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