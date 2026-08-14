"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function ButtonSection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 2xl:py-20 select-none antialiased">
      {/* Responsive Container: Fluid on Wide & Ultra-Wide Displays */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        {/* Editorial Frame with Thin Hairline Border */}
        <div className="border border-gray-200 bg-white shadow-none">
          

          {/* Main Grid: 7 Cols Left / 5 Cols Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* Left Hero Pane: Low-Opacity Soft Gradient */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 2xl:p-16 flex flex-col justify-between space-y-8 bg-linear-to-br from-emerald-50/70 via-stone-50/40 to-white text-gray-900">
              <div className="space-y-4 max-w-2xl">
               

                <h2 className="text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-light tracking-tight leading-[1.15] text-gray-950">
                  Exceptional craftsmanship.{" "}
                  <span className="font-semibold text-[#004d26]">
                    Curated without compromise.
                  </span>
                </h2>

                <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-normal leading-relaxed max-w-xl">
                  Every garment and textile is certified for origin and artisanal quality.
                  Shop with complete confidence from our vetted continent-wide designers.
                </p>
              </div>

              {/* Action Trigger */}
              <div className="pt-2">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-between gap-6 px-6 py-3.5 bg-[#004d26] text-white hover:bg-[#00361a] text-xs font-medium uppercase tracking-widest transition-colors duration-150 rounded-none shadow-none w-full sm:w-auto"
                >
                  <span>Explore Full Catalog</span>
                  <ArrowRight className="h-4 w-4 stroke-[1.5] transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Pathways Pane */}
            <div className="lg:col-span-5 flex flex-col divide-y divide-gray-200 bg-white">
              {/* 01 Departments */}
              <Link
                href="/categories"
                className="group flex-1 p-6 sm:p-7 2xl:p-8 flex flex-col justify-between hover:bg-emerald-50/30 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-gray-400">
                    01 &bull; Departments
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-[#004d26] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all stroke-[1.5]" />
                </div>
                <div className="mt-4 space-y-0.5">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-[#004d26] transition-colors">
                    Browse All Categories
                  </h3>
                  <p className="text-xs text-gray-500 font-normal">
                    Apparel, accessories, textiles, and contemporary lifestyle goods.
                  </p>
                </div>
              </Link>

              {/* 02 Women */}
              <Link
                href="/search?q=women"
                className="group flex-1 p-6 sm:p-7 2xl:p-8 flex flex-col justify-between hover:bg-emerald-50/30 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-gray-400">
                    02 &bull; Women
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-[#004d26] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all stroke-[1.5]" />
                </div>
                <div className="mt-4 space-y-0.5">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-[#004d26] transition-colors">
                    Women&apos;s Collection
                  </h3>
                  <p className="text-xs text-gray-500 font-normal">
                    Modern silhouettes, structured tailoring, and artisanal dresses.
                  </p>
                </div>
              </Link>

              {/* 03 Men */}
              <Link
                href="/search?q=men"
                className="group flex-1 p-6 sm:p-7 2xl:p-8 flex flex-col justify-between hover:bg-emerald-50/30 transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-wider uppercase text-gray-400">
                    03 &bull; Men
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-[#004d26] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all stroke-[1.5]" />
                </div>
                <div className="mt-4 space-y-0.5">
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-[#004d26] transition-colors">
                    Men&apos;s Collection
                  </h3>
                  <p className="text-xs text-gray-500 font-normal">
                    Tailored garments, tunics, casual wear, and footwear.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}