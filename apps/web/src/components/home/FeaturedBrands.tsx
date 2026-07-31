"use client";

import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import type { Brand } from "@africasuk/types";

import Container from "@/components/layout/Container";
import { Card } from "@/components/ui/card";

interface Props {
  brands: (Brand & { description?: string })[];
}

export default function FeaturedBrands({ brands = [] }: Props) {
  if (brands.length === 0) return null;

  // Tripled array for seamless infinite marquee loop
  const marqueeBrands = [...brands, ...brands, ...brands];

  return (
    <section className="relative py-16 lg:py-24 antialiased select-none border-y border-emerald-500/20 overflow-hidden">
      
      {/* --- FULLY VISIBLE PAGE BACKGROUND IMAGE --- */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/brandbg.jpg"
          alt="Brand Page Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-95 contrast-105"
        />
        {/* Slightly Increased Opacity White Light Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-white/95 via-white/30 to-white/95" />
      </div>

      {/* --- FULL SECTION-HEIGHT SIDE FADE OVERLAYS (z-20) --- */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 z-20 bg-linear-to-r from-white/90 via-white/40 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 z-20 bg-linear-to-l from-white/90 via-white/40 to-transparent" />

      <Container>
        {/* Section Header Elevated above Fades (z-30) */}
        <div className="relative z-30 mb-12 flex items-end justify-between gap-4 px-6 py-5 select-none">
<div className="space-y-2">
  {/* Green to Deep Dark Green Gradient Heading */}
  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase bg-linear-to-r from-emerald-400 via-emerald-700 to-[#002b15] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]">
    Popular Brands
  </h2>

  {/* Green to Dark Green Subtitle */}
  <p className="text-xs sm:text-sm font-bold max-w-md leading-relaxed bg-linear-to-r from-emerald-500 to-[#002b15] bg-clip-text text-transparent">
    Shop official collections directly from certified global partners.
  </p>
</div>

          <Link
            href="/brands"
            className="group relative inline-flex items-center gap-2 rounded-full bg-[#002b15]/80 backdrop-blur-xl border border-white/20 px-4 py-2 text-xs sm:text-sm font-bold tracking-widest uppercase text-white transition-all duration-300 hover:text-white hover:border-emerald-400/70 hover:bg-[#002b15] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0 shadow-lg"
          >
            <span>View All</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-300" />
          </Link>
        </div>
      </Container>

      {/* Marquee Track */}
      <div className="relative w-full overflow-hidden py-4">
        <div className="animate-marquee-slow flex items-center gap-6 sm:gap-8">
          {marqueeBrands.map((brand, index) => (
            <Link
              key={`${brand.id}-${index}`}
              href={`/brands/${brand.slug}`}
              className="group relative block shrink-0 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Premium Frosted Glass Card */}
              <Card className="relative w-72 sm:w-80 h-56 sm:h-64 bg-[#002b15]/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl group-hover:shadow-emerald-400/25 group-hover:border-emerald-400/80 group-hover:bg-[#002b15]/85 transition-all duration-300 overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none">
                
                {/* Top Specular Glass Highlights */}
                <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-400/20 blur-2xl pointer-events-none z-0 group-hover:bg-emerald-300/35 transition-all duration-500" />
                <div className="absolute top-0 inset-x-0 h-[1px] bg-linear-to-r from-transparent via-white/50 to-transparent z-0" />

                {/* Top Action Icon */}
                <div className="flex items-center justify-end z-10">
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white transition-all duration-300 group-hover:bg-emerald-400 group-hover:text-emerald-950 group-hover:border-emerald-300 group-hover:rotate-45 shadow-md">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                {/* Expanded Hero Logo Display */}
                <div className="relative w-full h-24 sm:h-28 rounded-xl bg-white/95 backdrop-blur-md border border-white/30 p-2 flex items-center justify-center my-auto z-10 shadow-lg group-hover:bg-white transition-all duration-300">
                  {brand.logoUrl ? (
                    <div className="relative w-56 sm:w-64 h-full transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 640px) 224px, 256px"
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl font-black text-emerald-950 shadow-md">
                      {brand.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Bottom Card Metadata */}
                <div className="z-10 pt-2.5 border-t border-white/15 group-hover:border-emerald-400/50 transition-colors">
                  <h3 className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors duration-200 leading-snug line-clamp-1 uppercase drop-shadow-xs">
                    {brand.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-emerald-100/80 font-medium line-clamp-1 drop-shadow-xs">
                    {brand.description || `Browse official ${brand.name} items`}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}