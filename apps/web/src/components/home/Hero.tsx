"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronUp, ChevronDown } from "lucide-react";
import type { Category } from "@africasuk/types";

interface HeroProps {
  categories: Category[];
}

export default function Hero({ categories = [] }: HeroProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Seamless Auto-Rotation Loop Engine
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => resetTimeout();
  }, [activeIndex, categories]);

  if (categories.length === 0) return null;

  const currentCategory = categories[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] lg:min-h-145 flex items-center bg-white text-gray-900 overflow-hidden select-none antialiased border-b border-gray-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-center justify-between py-8 lg:py-12">
        
        {/* LEFT COLUMN: VERTICAL CIRCULAR ROTATOR NAVIGATION */}
        <div className="hidden lg:col-span-2 lg:flex flex-col items-center justify-center relative h-fit border-r border-gray-100 pr-6">
          <button
            onClick={handlePrev}
            className="mb-2 text-gray-400 hover:text-[#005c2e] transition-colors p-1 cursor-pointer"
            aria-label="Previous Category"
          >
            <ChevronUp className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-3.5 items-center my-1">
            {categories.slice(0, 5).map((category, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveIndex(index)}
                  className="flex flex-col items-center group focus:outline-hidden cursor-pointer w-full"
                >
                  <div
                    className={`relative rounded-full overflow-hidden transition-all duration-300 ease-out border
                      ${
                        isActive
                          ? "w-12 h-12 border-[#005c2e] ring-2 ring-[#005c2e]/20 scale-105"
                          : "w-9 h-9 border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                  >
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="48px"
                        quality={80}
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100" />
                    )}
                  </div>
                  <span
                    className={`mt-1 text-[10px] font-medium tracking-tight text-center max-w-16 truncate transition-colors duration-200
                      ${isActive ? "text-[#005c2e] font-semibold" : "text-gray-400 group-hover:text-gray-600"}`}
                  >
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="mt-2 text-gray-400 hover:text-[#005c2e] transition-colors p-1 cursor-pointer"
            aria-label="Next Category"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* MIDDLE COLUMN: MODERN MINIMAL DYNAMIC TEXT BRANDING */}
        <div className="w-full lg:col-span-5 flex flex-col items-start justify-center z-20 order-2 lg:order-2 space-y-4">
          
          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#005c2e]">
              0{activeIndex + 1}
            </span>
            <div className="h-px w-6 bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">
              0{categories.length}
            </span>
          </div>

          <h1
            key={`title-${currentCategory.id}`}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-3 duration-500"
          >
            {currentCategory.name}
          </h1>

          <p
            key={`desc-${currentCategory.id}`}
            className="text-sm text-gray-500 leading-relaxed font-normal line-clamp-3 lg:line-clamp-4 max-w-md animate-in fade-in slide-in-from-bottom-2 duration-700"
          >
            {currentCategory.description ||
              `Discover our premium handpicked collection of ${currentCategory.name.toLowerCase()} items.`}
          </p>

          {/* CTA Link Trigger - Desktop */}
          <div className="hidden sm:block pt-2 animate-in fade-in slide-in-from-bottom-1 duration-1000">
            <Link
              href={`/categories/${currentCategory.slug}`}
              className="inline-flex items-center gap-2 group text-xs font-semibold uppercase tracking-wider text-white bg-[#002b15] hover:bg-[#005c2e] px-7 py-3.5 rounded-full shadow-xs active:scale-98 transition-all duration-300"
            >
              <span>Explore Collection</span>
              <ArrowUpRight className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: HERO FEATURE IMAGE */}
        <div className="relative w-full h-80 sm:h-100 lg:h-112 lg:col-span-5 flex items-center justify-center z-10 order-1 lg:order-3 shrink-0">
          <div
            key={`mask-${currentCategory.id}`}
            className="relative w-full h-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-xs animate-in fade-in zoom-in-95 duration-700"
          >
            {currentCategory.imageUrl ? (
              <Image
                src={currentCategory.imageUrl}
                alt={currentCategory.name}
                fill
                priority
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 550px"
                className="object-cover transition-transform duration-700 ease-out hover:scale-102"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 font-medium text-xs">
                No Image Available
              </div>
            )}
          </div>
        </div>

        {/* MOBILE CENTRAL BUTTON */}
        <div className="w-full flex justify-center sm:hidden order-3 z-30 my-2 shrink-0">
          <Link href={`/categories/${currentCategory.slug}`} className="w-full">
            <button className="w-full flex items-center justify-center gap-2 bg-[#002b15] active:bg-[#005c2e] text-white font-semibold text-xs uppercase tracking-wider py-3.5 px-8 rounded-full shadow-xs active:scale-98 transition-transform cursor-pointer">
              <span>Explore Collection</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}