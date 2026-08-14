"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@africasuk/types";

interface HeroProps {
  categories: Category[];
}

export default function Hero({ categories = [] }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement | null>(null);

  const total = categories.length;

  const scrollToThumbnail = useCallback((index: number) => {
    if (!thumbnailContainerRef.current) return;
    const container = thumbnailContainerRef.current;
    const activeItem = container.children[index] as HTMLElement | undefined;

    if (activeItem) {
      const scrollLeft =
        activeItem.offsetLeft -
        container.offsetWidth / 2 +
        activeItem.offsetWidth / 2;

      container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: "smooth",
      });
    }
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(index);
      scrollToThumbnail(index);
    },
    [scrollToThumbnail]
  );

  const handleNext = useCallback(() => {
    if (!total) return;
    const nextIndex = (activeIndex + 1) % total;
    handleSelect(nextIndex);
  }, [activeIndex, total, handleSelect]);

  const handlePrev = useCallback(() => {
    if (!total) return;
    const prevIndex = (activeIndex - 1 + total) % total;
    handleSelect(prevIndex);
  }, [activeIndex, total, handleSelect]);

  // Auto-slide every 3 seconds (pauses on hover)
  useEffect(() => {
    if (total <= 1 || isInteracting) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isInteracting, handleNext]);

  if (!total) return null;

  const currentCategory = categories[activeIndex];

  return (
    <section
      className="relative w-full bg-white text-gray-900 select-none overflow-hidden py-3 sm:py-5 border-b border-gray-100 antialiased"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      {/* 1. TOP SECTION: STANDARD CENTERED HERO BANNER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/categories/${currentCategory.slug}`}
          className="group relative w-full h-55 sm:h-80 md:h-100 lg:h-115 bg-gray-100 rounded-none overflow-hidden border border-gray-200 block focus:outline-none"
        >
          {/* Background Image */}
          {currentCategory.imageUrl ? (
            <Image
              key={`hero-img-${currentCategory.id}`}
              src={currentCategory.imageUrl}
              alt={currentCategory.name}
              fill
              priority
              quality={90}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-102 animate-in fade-in"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No Image Available
            </div>
          )}

          {/* Clean Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-1 max-w-xl">
              <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                {currentCategory.name}
              </h2>
              <div className="flex items-center gap-1.5 text-white/90 group-hover:text-white text-xs sm:text-sm font-medium tracking-wide mt-1">
                <span>Explore Collection</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 2. BOTTOM SECTION: FULL SCREEN WIDTH THUMBNAIL STRIP */}
      <div className="w-full mt-3 sm:mt-4 px-4 sm:px-6 lg:px-12">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400">
            CATEGORIES ({total})
          </span>

          {/* Prev / Next Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 sm:p-1.5 border border-gray-200 text-gray-600 hover:text-[#008744] hover:border-[#008744] active:scale-95 transition-all cursor-pointer rounded-none bg-white"
              aria-label="Previous Category"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1 sm:p-1.5 border border-gray-200 text-gray-600 hover:text-[#008744] hover:border-[#008744] active:scale-95 transition-all cursor-pointer rounded-none bg-white"
              aria-label="Next Category"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Small Cards Scrolling Across Full Screen Width */}
        <div
          ref={thumbnailContainerRef}
          className="w-full flex items-center justify-start gap-2 sm:gap-2.5 overflow-x-auto pb-1 scroll-smooth scrollbar-none"
        >
          {categories.map((category, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                type="button"
                key={category.id}
                onClick={() => handleSelect(index)}
                className="group shrink-0 flex flex-col items-start w-18 sm:w-21 md:w-24 lg:w-26 xl:w-27.5 text-left focus:outline-none cursor-pointer"
              >
                {/* Square Box Container */}
                <div
                  className={`relative aspect-square w-full rounded-none overflow-hidden border transition-all duration-200 ${
                    isActive
                      ? "border-2 border-[#008744] opacity-100"
                      : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-300"
                  }`}
                >
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 72px, (max-width: 1024px) 96px, 110px"
                      quality={75}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}

                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

                  {/* Inside Label */}
                  <span className="absolute bottom-1 left-1 right-1 text-[10px] sm:text-[11px] font-medium text-white truncate text-center leading-tight">
                    {category.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}