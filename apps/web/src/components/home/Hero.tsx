"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Category } from "@africasuk/types";

interface HeroProps {
  categories: Category[];
}

export default function Hero({ categories = [] }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = categories.length;

  const handleSelect = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setIsImageLoading(true);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  const handleNext = useCallback(() => {
    if (!total) return;
    handleSelect((activeIndex + 1) % total);
  }, [total, activeIndex, handleSelect]);

  const handlePrev = useCallback(() => {
    if (!total) return;
    handleSelect((activeIndex - 1 + total) % total);
  }, [total, activeIndex, handleSelect]);

  useEffect(() => {
    if (total <= 1 || isInteracting) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isInteracting, handleNext]);

  if (!total) return null;

  const currentCategory = categories[activeIndex];

  // Flanking preview pins
  const leftPins = [
    categories[(activeIndex - 2 + total) % total],
    categories[(activeIndex - 1 + total) % total],
  ];
  const rightPins = [
    categories[(activeIndex + 1) % total],
    categories[(activeIndex + 2) % total],
  ];

  return (
    <section
      className="relative w-full bg-white text-gray-900 select-none py-6 sm:py-10 border-b border-gray-100 antialiased overflow-hidden"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Strip */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Featured Categories
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 border border-gray-200 text-gray-600 hover:text-[#008744] hover:border-[#008744] active:scale-95 transition-all rounded-full bg-white cursor-pointer"
              aria-label="Previous category"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 border border-gray-200 text-gray-600 hover:text-[#008744] hover:border-[#008744] active:scale-95 transition-all rounded-full bg-white cursor-pointer"
              aria-label="Next category"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Pinterest Stage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-8 items-start">
          {/* Left Column (Stacked Pins) */}
          <div className="hidden md:flex md:col-span-3 flex-col gap-6">
            {leftPins.map((cat, idx) => (
              <div
                key={`left-pin-${cat.id}-${idx}`}
                className="flex flex-col items-center text-center cursor-pointer group"
                onClick={() =>
                  handleSelect(categories.findIndex((c) => c.id === cat.id))
                }
              >
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 transition-transform duration-300 group-hover:scale-[1.02] active:scale-95">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <span className="mt-2.5 text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-900 truncate w-full">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          {/* Center Main Pin (Large Showcase) */}
          <div className="col-span-1 md:col-span-6 flex flex-col items-center">
            <Link
              href={`/categories/${currentCategory.slug}`}
              className="group block w-full max-w-120 focus:outline-none"
            >
              {/* 1:1 Image Card Container */}
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 transition-transform duration-500 group-hover:scale-[1.01]">
                {/* Loading Skeleton & Spinner */}
                {isImageLoading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100/90 animate-pulse transition-opacity">
                    <Loader2 className="w-7 h-7 text-[#008744] animate-spin" />
                  </div>
                )}

                {currentCategory.imageUrl ? (
                  <Image
                    key={`pinterest-hero-${currentCategory.id}`}
                    src={currentCategory.imageUrl}
                    alt={currentCategory.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    onLoad={() => setIsImageLoading(false)}
                    className={`object-cover transition-all duration-500 ${
                      isImageLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Title & Link Placed Below */}
              <div className="mt-4 flex flex-col items-center text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight transition-colors group-hover:text-[#008744]">
                  {currentCategory.name}
                </h3>
                <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#008744] mt-1.5 hover:underline">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>

          {/* Right Column (Stacked Pins) */}
          <div className="hidden md:flex md:col-span-3 flex-col gap-6">
            {rightPins.map((cat, idx) => (
              <div
                key={`right-pin-${cat.id}-${idx}`}
                className="flex flex-col items-center text-center cursor-pointer group"
                onClick={() =>
                  handleSelect(categories.findIndex((c) => c.id === cat.id))
                }
              >
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 transition-transform duration-300 group-hover:scale-[1.02] active:scale-95">
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <span className="mt-2.5 text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-gray-900 truncate w-full">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Horizontal Carousel */}
        <div className="flex md:hidden items-start gap-4 overflow-x-auto pt-4 pb-2 scrollbar-none">
          {categories.map((cat, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={`mobile-pin-${cat.id}`}
                type="button"
                onClick={() => handleSelect(index)}
                className="flex flex-col items-center w-24 shrink-0 focus:outline-none cursor-pointer"
              >
                <div
                  className={`relative w-full aspect-square rounded-2xl overflow-hidden border bg-gray-50 transition-all ${
                    isActive
                      ? "border-2 border-[#008744] scale-105"
                      : "border-gray-200 opacity-60 active:scale-95"
                  }`}
                >
                  {cat.imageUrl && (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[11px] truncate w-full text-center ${
                    isActive
                      ? "font-bold text-[#008744]"
                      : "text-gray-600 font-medium"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}