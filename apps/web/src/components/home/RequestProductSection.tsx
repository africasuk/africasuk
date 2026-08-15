"use client";

import Link from "next/link";
import { Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RequestProductSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center border-y border-zinc-800/60 py-12 bg-[#021a0d]">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-125 w-125 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />

        <div
          className="absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-green-400/15 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div
          className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-700/10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Floating circles */}
        <div className="absolute top-[20%] left-[15%] h-3 w-3 rounded-full bg-emerald-400/60 animate-bounce" />
        <div
          className="absolute top-[65%] left-[25%] h-2 w-2 rounded-full bg-green-300/50 animate-bounce"
          style={{ animationDelay: "0.7s" }}
        />
        <div
          className="absolute top-[30%] right-[20%] h-3 w-3 rounded-full bg-emerald-300/50 animate-bounce"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute bottom-[20%] right-[30%] h-2 w-2 rounded-full bg-green-400/50 animate-bounce"
          style={{ animationDelay: "1.8s" }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/60" />

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300 backdrop-blur-md shadow-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />

          <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Can&apos;t find it?
          </span>
        </div>

        {/* Headline */}
        <h2 className="mt-6 text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Can&apos;t Find What You Need?
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-md sm:max-w-xl text-sm sm:text-base lg:text-xl text-zinc-100 font-medium leading-relaxed">
          Snap a photo or share a description. Our sourcing specialists will
          locate and list it for you.
        </p>

        {/* CTA */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 sm:h-14 px-7 sm:px-9 rounded-full bg-linear-to-r from-[#002b15] via-emerald-800 to-emerald-500 hover:from-[#003d1e] hover:to-emerald-400 text-white font-semibold text-sm sm:text-base tracking-wide border border-emerald-400/40 shadow-2xl shadow-black/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
          >
            <Link
              href="/request-product"
              className="flex items-center justify-center gap-2.5 sm:gap-3"
            >
              <Camera className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2] text-emerald-300" />
              <span>Request Custom Product</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}