"use client";

import Link from "next/link";
import { ShoppingBag, LayoutGrid, ArrowUpRight } from "lucide-react";

export function ButtonSection() {
  return (
    <section className="py-12 sm:py-20 select-none antialiased">
      {/* Full-Width Container */}
      <div className="max-w-none w-full px-4 sm:px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-[#001f10] border border-emerald-900/40 p-8 sm:p-14 lg:p-20 shadow-2xl">
          
          {/* Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-full max-w-2xl rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
            
            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white/95 leading-tight">
              Ready to find what you&apos;re looking for?
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-emerald-100/70 font-normal max-w-xl leading-relaxed">
              Explore our curated store catalog or browse by department to find exactly what fits your style.
            </p>

            {/* Interactive Tactile Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              
              {/* Primary: Start Shopping */}
              <div className="relative w-full sm:w-auto group">
                {/* Soft Glowing Aura on Hover */}
                <div className="absolute -inset-0.5 rounded-full bg-linear-to-r from-emerald-400 to-emerald-200 opacity-40 blur-md transition duration-500 group-hover:opacity-100 group-hover:blur-lg" />
                
                <Link
                  href="/products"
                  className="relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#002b15] font-semibold text-sm cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 shadow-md hover:shadow-xl hover:shadow-emerald-500/10"
                >
                  <ShoppingBag className="w-4 h-4 text-[#002b15] transition-transform duration-300 group-hover:scale-110" />
                  <span>Start Shopping</span>
                  <ArrowUpRight className="w-4 h-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </div>

              {/* Secondary: All Categories */}
              <Link
                href="/categories"
                className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 text-white border border-white/15 hover:border-emerald-400/50 backdrop-blur-md text-sm font-medium cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95 shadow-xs hover:shadow-lg hover:shadow-black/20"
              >
                <LayoutGrid className="w-4 h-4 text-emerald-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span>All Categories</span>
              </Link>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}