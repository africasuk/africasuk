
"use client";

import Image from "next/image";
import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";

export function RequestProductSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-14 text-gray-900 antialiased sm:py-20 lg:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">

          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <span className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#008744] sm:text-xs">
              Looking for Something Specific?
            </span>

            <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              Can&apos;t find it?
              <br />
              <span className="text-[#008744]">Just ask us.</span>
            </h2>

            <div className="mt-6 max-w-xl sm:mt-8">
              <p className="text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                Send us a photo, product name, or link. If the product is
                available from our suppliers, we&apos;ll help you find it
                and arrange the purchase.
              </p>
            </div>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap items-center gap-5 sm:mt-9">
              <Link
                href="/request-product"
                className="group inline-flex items-center gap-3 rounded-full bg-gray-950 px-6 py-3.5 text-xs font-semibold tracking-wide text-white transition-all duration-300 hover:bg-[#008744] hover:shadow-lg hover:shadow-[#008744]/20 active:scale-95 sm:text-sm"
              >
                <Camera className="h-4 w-4 text-white/80 transition-colors group-hover:text-white" />

                <span>Request a Product</span>

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-3 w-3 text-white" />
                </span>
              </Link>

              <span className="text-xs text-gray-400">
                Simple. Easy. Convenient.
              </span>
            </div>
          </div>

          {/* Right Product Request Image */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/70 blur-[90px]" />

           <Image
              src="/request-product.png"
              alt="Request any product through Africa Suk"
              width={1647}
              height={1024}
              priority
              draggable={false}
              className="pointer-events-none relative z-10 h-auto w-full select-none object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
