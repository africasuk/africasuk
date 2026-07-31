"use client";

import Link from "next/link";
import { Camera, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RequestProductSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center border-y border-zinc-800/60 py-12">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover scale-105 pointer-events-none"
      >
        <source
          src="https://gzfhrrnvstoeoaxdsbxc.supabase.co/storage/v1/object/public/videos/Video%20Project%2012.mp4"
          type="video/mp4"
        />
      </video>

      {/* Video Overlays for Contrast */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/60" />

      {/* Hero Content Container */}
      <div className="relative z-10 container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Sourcing Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300 backdrop-blur-md shadow-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur">
          Can&apos;t find it?
        </span>
        </div>

        {/* Headline */}
        <h2 className="mt-6 text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
          Can&apos;t Find What You Need?
        </h2>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-md sm:max-w-xl text-sm sm:text-base lg:text-xl text-zinc-100 font-medium leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]">
          Snap a photo or share a description. Our sourcing specialists will locate and list it for you.
        </p>

        {/* CTA Button */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 sm:h-14 px-7 sm:px-9 rounded-full bg-linear-to-r from-[#002b15] via-emerald-800 to-emerald-500 hover:from-[#003d1e] hover:to-emerald-400 text-white font-semibold text-sm sm:text-base tracking-wide border border-emerald-400/40 shadow-2xl shadow-black/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
          >
            <Link href="/request-product" className="flex items-center justify-center gap-2.5 sm:gap-3">
              <Camera className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2] text-emerald-300 shrink-0" />
              <span>Request Custom Product</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}