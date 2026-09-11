"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function ButtonSection() {
  const pathways = [
    {
      index: "01",
      title: "All Products",
      description: "Explore everything currently available on Africa Suk.",
      href: "/products",
    },
    {
      index: "02",
      title: "Shop by Category",
      description: "Find electronics, fashion, home, food, and more.",
      href: "/categories",
    },
    {
      index: "03",
      title: "Request a Product",
      description: "Can't find what you need? Tell us what you're looking for.",
      href: "/request-product",
    },
  ];

  return (
    <section className="w-full border-b border-gray-100 bg-white py-12 antialiased select-none sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Left Editorial Text Column */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-6 xl:col-span-7 sm:space-y-8">
            <div className="max-w-xl space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#008744]">
                Africa Suk
              </span>

              <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl">
                More products,{" "}
                <span className="text-[#008744]">
                  easier shopping.
                </span>
              </h2>

              <p className="text-sm font-normal leading-relaxed text-gray-600 sm:text-base">
                We source products from regional and international suppliers
                and make them available to customers in South Sudan. Browse
                our selection online or request a product you are looking for.
              </p>
            </div>

            {/* Primary Button */}
            <div className="pt-2">
              <Link
                href="/products"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#008744] active:scale-[0.98] sm:w-auto sm:text-sm"
              >
                <span>Shop All Products</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Pathway Rows */}
          <div className="flex flex-col divide-y divide-gray-100 lg:col-span-6 xl:col-span-5">
            {pathways.map((item) => (
              <div
                key={item.index}
                className="flex items-center justify-between gap-4 py-5 first:pt-0 last:pb-0"
              >
                <div className="space-y-0.5 pr-2">
                  <span className="font-mono text-[11px] text-gray-400">
                    {item.index}
                  </span>

                  <h3 className="text-base font-semibold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="text-xs font-normal text-gray-500 sm:text-sm">
                    {item.description}
                  </p>
                </div>

                <Link
                  href={item.href}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-300 px-3.5 py-1.5 text-xs font-semibold text-gray-800 transition-colors hover:border-[#008744] hover:text-[#008744] active:scale-95"
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