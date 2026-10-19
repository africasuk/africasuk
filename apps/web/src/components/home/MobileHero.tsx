"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@africasuk/types";

interface MobileHeroProps {
  categories: Category[];
  autoPlayInterval?: number;
}

export default function MobileHero({
  categories,
  autoPlayInterval = 5500,
}: MobileHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = categories.length;
  const safeIndex = total > 0 ? activeIndex % total : 0;
  const activeCategory = categories[safeIndex];

  const goToSlide = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsPaused(true);
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    setIsPaused(false);
    if (touchStartX.current === null || touchStartY.current === null) return;

    const endX = event.changedTouches[0]?.clientX;
    const endY = event.changedTouches[0]?.clientY;

    if (endX === undefined || endY === undefined) return;

    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      goToSlide(safeIndex + (deltaX < 0 ? 1 : -1));
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, autoPlayInterval);

    return () => window.clearInterval(timer);
  }, [total, isPaused, autoPlayInterval]);

  if (!categories || total === 0 || !activeCategory) return null;

  const maxVisibleDots = 7;
  const getVisibleDotIndices = () => {
    if (total <= maxVisibleDots) return categories.map((_, i) => i);
    const half = Math.floor(maxVisibleDots / 2);
    let start = Math.max(0, safeIndex - half);
    const end = Math.min(total, start + maxVisibleDots);
    if (end - start < maxVisibleDots) {
      start = Math.max(0, end - maxVisibleDots);
    }
    return Array.from({ length: end - start }, (_, i) => start + i);
  };

  return (
    <section
      aria-label="Featured Collections"
      className="relative w-full overflow-hidden bg-white select-none lg:hidden"
    >
      {/* 1:1 Aspect Ratio Hero Container */}
      <div
        className="relative aspect-square w-full touch-pan-y overflow-hidden rounded-b-[2rem] sm:rounded-b-[2.5rem] shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Images Layer */}
        {categories.map((category, index) => {
          const isActive = index === safeIndex;
          return (
            <div
              key={category.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isActive ? "z-0 opacity-100" : "-z-10 pointer-events-none opacity-0"
              }`}
            >
              {category.imageUrl ? (
               <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 639px) 85vw, (max-width: 1023px) 50vw, 33vw"
                  draggable={false}
                  className={`object-cover object-center transition-transform duration-1000 ease-out ${
                    isActive ? "scale-100" : "scale-105"
                  }`}
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-[#00381b] via-[#004d26] to-[#00733a]" />
              )}
            </div>
          );
        })}

        {/* Soft, light gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/30 via-35% to-transparent" />

        {/* Compact Hero Content Box */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-4 text-white sm:p-6">
          {/* Badge */}
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 drop-shadow-sm">
              Curated Collection
            </p>
          </div>

          {/* Heading */}
          <h1 className="line-clamp-2 max-w-[95%] text-lg font-extrabold leading-snug tracking-tight text-white drop-shadow-md xs:text-xl sm:text-2xl">
            {activeCategory.name}
          </h1>

          {/* Subtitle */}
          <p className="mt-1 line-clamp-1 max-w-xs text-xs font-medium leading-relaxed text-white/90 drop-shadow-sm sm:text-sm">
            Discover something special curated just for you.
          </p>

          {/* CTA & Counter Row */}
          <div className="mt-3 flex items-center justify-between gap-3">
            {/* Compact CTA Button with Black Text */}
            <Link
              href={`/categories/${activeCategory.slug}`}
              className="group inline-flex min-h-9 items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-900 shadow-md transition-all duration-200 hover:bg-neutral-100 active:scale-95"
            >
              <span>Explore collection</span>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight size={12} strokeWidth={2.75} />
              </span>
            </Link>

            {/* Slide Index Counter */}
            {total > 1 && (
              <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-md">
                <span>{String(safeIndex + 1).padStart(2, "0")}</span>
                <span className="text-white/40">/</span>
                <span className="text-white/70">{String(total).padStart(2, "0")}</span>
              </div>
            )}
          </div>

          {/* Compact Pagination Dots */}
          {total > 1 && (
            <div className="mt-3 flex items-center justify-center gap-1.5">
              {getVisibleDotIndices().map((index) => {
                const isSelected = index === safeIndex;
                return (
                  <button
                    key={categories[index].id}
                    type="button"
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => goToSlide(index)}
                    className="group relative flex h-4 items-center justify-center px-0.5"
                  >
                    <span
                      className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                        isSelected
                          ? "w-5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                          : "w-1.5 bg-white/40 group-hover:bg-white/70"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}