"use client";

import Link from "next/link";
import { ShoppingBag, LayoutGrid, ArrowUpRight } from "lucide-react";

export function ButtonSection() {
  return (
    <section className="py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#001f10] border border-emerald-900/40 p-8 sm:p-14 lg:p-16 shadow-xl">
          
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-lg rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
            
            {/* Elegant Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white/95 leading-tight">
              Ready to find what you&apos;re looking for?
            </h2>

            {/* Clean Subtitle */}
            <p className="text-sm sm:text-base text-emerald-100/70 font-normal max-w-lg leading-relaxed">
              Explore our curated store catalog or browse by department to find exactly what fits your style.
            </p>

            {/* Subtle Minimal Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
              
              {/* Primary: Start Shopping */}
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-[#002b15] font-semibold text-sm transition-all duration-300 hover:bg-emerald-50 hover:shadow-lg hover:shadow-white/10 active:scale-98"
              >
                <ShoppingBag className="w-4 h-4 text-[#002b15]" />
                <span>Start Shopping</span>
                <ArrowUpRight className="w-4 h-4 opacity-50 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              {/* Secondary: All Categories */}
              <Link
                href="/categories"
                className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 text-sm font-medium transition-all duration-300 active:scale-98"
              >
                <LayoutGrid className="w-4 h-4 text-emerald-400" />
                <span>All Categories</span>
              </Link>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}