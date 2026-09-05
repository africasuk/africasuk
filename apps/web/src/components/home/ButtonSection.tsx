"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function ButtonSection() {
  const pathways = [
    {
      index: "01",
      title: "All Categories",
      description: "Clothes, accessories, and home goods.",
      href: "/categories",
    },
    {
      index: "02",
      title: "Women",
      description: "Dresses, tops, and everyday wear.",
      href: "/search?q=women",
    },
    {
      index: "03",
      title: "Men",
      description: "Shirts, pants, shoes, and classics.",
      href: "/search?q=men",
    },
  ];

  return (
    <section className="w-full py-12 sm:py-20 bg-white select-none antialiased border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between space-y-6 sm:space-y-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#008744]">
                100% Authentic
              </span>

              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-950 leading-tight">
                Quality you trust,{" "}
                <span className="text-[#008744]">made to last.</span>
              </h2>

              <p className="text-sm sm:text-base text-gray-600 font-normal leading-relaxed">
                Every item is carefully checked for genuine quality. Shop with confidence from top designers across Africa.
              </p>
            </div>

            {/* Clean, Visible Primary Button */}
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#008744] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-full transition-colors active:scale-[0.98] w-full sm:w-auto"
              >
                <span>Shop All</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Pathway Rows */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col divide-y divide-gray-100">
            {pathways.map((item) => (
              <div
                key={item.index}
                className="py-5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5 pr-2">
                  <span className="text-[11px] font-mono text-gray-400">
                    {item.index}
                  </span>
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Minimal Pill Button */}
                <Link
                  href={item.href}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-gray-800 hover:text-[#008744] border border-gray-300 hover:border-[#008744] rounded-full px-3.5 py-1.5 transition-colors active:scale-95"
                >
                  <span>View</span>
                  <ArrowUpRight className="h-3.5 w-3.5 stroke-2" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}