"use client";

import Link from "next/link";
import { Camera, Search, FileText, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RequestProductSection() {
  const steps = [
    {
      number: "01",
      title: "UPLOAD A PHOTO",
      description: "Upload a picture of the product you want to source.",
      icon: Camera,
    },
    {
      number: "02",
      title: "DESCRIBE IT",
      description: "Tell us details like preferred color, size, and quantity.",
      icon: FileText,
    },
    {
      number: "03",
      title: "WE SOURCE IT",
      description: "Our team searches trusted suppliers and notifies you when ready.",
      icon: Truck,
    },
  ];

  return (
    <section className="py-12 sm:py-20 bg-gray-50/50 antialiased select-none border-y border-gray-100 overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center space-y-2.5 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-emerald-100 bg-emerald-50/60 px-3 sm:px-4 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#005c2e]">
            <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#005c2e]" />
            Can&apos;t find a product?
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight uppercase">
            Request Any Product
          </h2>

          <p className="text-xs sm:text-base text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto px-2">
            Looking for a product that&apos;s not listed on AfricaSuk? Upload a
            photo, tell us what you need, and our sourcing team will work to
            find it for you.
          </p>

          {/* Centered Primary CTA - Compact on Mobile */}
          <div className="pt-3 sm:pt-6 flex justify-center">
            <Button
              asChild
              size="lg"
              className="h-11 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-r from-[#002b15] to-[#005c2e] px-5 sm:px-8 text-xs sm:text-base font-extrabold text-white shadow-md sm:shadow-lg shadow-[#002b15]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-98"
            >
              <Link href="/request-product" className="flex items-center gap-2 sm:gap-3">
                <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                Request a Product
              </Link>
            </Button>
          </div>
        </div>

        {/* Isometric Stepped Process Flow - Scaled down gap & elements on mobile */}
        <div className="relative mt-12 sm:mt-24 max-w-5xl mx-auto">
          {/* Zig-zag Connecting Line */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-emerald-200/80 z-0" />

          <div className="grid gap-8 sm:gap-16 md:grid-cols-3 md:gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={step.number}
                  className={`flex flex-col items-center text-center transition-transform duration-300 ${
                    isEven ? "md:mt-12" : ""
                  }`}
                >
                  {/* Step Number Tag */}
                  <span className="text-lg sm:text-2xl font-black italic tracking-wider text-[#005c2e] mb-1.5 sm:mb-3">
                    {step.number}
                  </span>

                  {/* Tilted Isometric Floating Tile Container - Compact sizing on mobile */}
                  <div className="relative group mb-4 sm:mb-8 perspective-1000">
                    {/* Glowing Under-shadow */}
                    <div className="absolute -inset-1.5 sm:-inset-2 rounded-xl sm:rounded-2xl bg-linear-to-r from-[#002b15] to-[#005c2e] opacity-25 blur-lg sm:blur-xl transition-all duration-300 group-hover:opacity-40 group-hover:blur-2xl" />

                    {/* Angled 3D Tile Card */}
                    <div className="relative flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-xl sm:rounded-2xl border border-emerald-100 bg-white/90 backdrop-blur-xs shadow-md sm:shadow-xl transform-gpu rotate-x-12 -rotate-z-6 skew-x-3 transition-all duration-500 ease-out group-hover:rotate-x-0 group-hover:rotate-z-0 group-hover:skew-x-0 group-hover:-translate-y-2 group-hover:shadow-2xl">
                      <Icon className="h-8 w-8 sm:h-11 sm:w-11 text-[#005c2e] transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Step Description */}
                  <h3 className="text-xs sm:text-base font-black text-gray-900 tracking-wider uppercase mb-1 sm:mb-2">
                    {step.title}
                  </h3>

                  <p className="text-[11px] sm:text-sm font-medium text-gray-500 leading-normal sm:leading-relaxed max-w-xs px-2">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}