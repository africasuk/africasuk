"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import type { Category } from "@africasuk/types";

interface HeroProps {
  categories: Category[];
}

export default function Hero({
  categories = [],
}: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const mobileCarouselRef =
    useRef<HTMLDivElement | null>(null);

  const mobileCardRefs = useRef<
    Record<string, HTMLButtonElement | null>
  >({});

  const mobileScrollTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const total = categories.length;

  /*
   * --------------------------------------------------
   * CENTER MOBILE CATEGORY
   * --------------------------------------------------
   *
   * IMPORTANT:
   * Do NOT use scrollIntoView() here.
   *
   * scrollIntoView() can scroll the entire page vertically.
   * We only want to change the horizontal carousel position.
   */
  const centerMobileCategory = useCallback(
    (
      index: number,
      behavior: ScrollBehavior = "smooth",
    ) => {
      const category = categories[index];

      if (!category) return;

      const container = mobileCarouselRef.current;
      const card = mobileCardRefs.current[category.id];

      if (!container || !card) return;

      const containerCenter =
        container.clientWidth / 2;

      const cardCenter =
        card.offsetLeft + card.offsetWidth / 2;

      const targetScrollLeft =
        cardCenter - containerCenter;

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior,
      });
    },
    [categories],
  );

  /*
   * --------------------------------------------------
   * SELECT CATEGORY
   * --------------------------------------------------
   */
  const handleSelect = useCallback(
    (index: number) => {
      if (!total) return;

      if (index < 0 || index >= total) return;

      setIsImageLoading(true);
      setActiveIndex(index);
    },
    [total],
  );

  /*
   * --------------------------------------------------
   * NEXT
   * --------------------------------------------------
   */
  const handleNext = useCallback(() => {
    if (!total) return;

    handleSelect(
      (activeIndex + 1) % total,
    );
  }, [total, activeIndex, handleSelect]);

  /*
   * --------------------------------------------------
   * PREVIOUS
   * --------------------------------------------------
   */
  const handlePrev = useCallback(() => {
    if (!total) return;

    handleSelect(
      (activeIndex - 1 + total) % total,
    );
  }, [total, activeIndex, handleSelect]);

  /*
   * --------------------------------------------------
   * AUTO CENTER ACTIVE CATEGORY
   * --------------------------------------------------
   */
  useEffect(() => {
    if (!total) return;

    const timer = window.setTimeout(() => {
      centerMobileCategory(
        activeIndex,
        "smooth",
      );
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    activeIndex,
    total,
    centerMobileCategory,
  ]);

  /*
   * --------------------------------------------------
   * AUTOPLAY
   * --------------------------------------------------
   */
  useEffect(() => {
    if (
      total <= 1 ||
      isInteracting
    ) {
      return;
    }

    timerRef.current = setInterval(() => {
      setActiveIndex((current) =>
        (current + 1) % total,
      );

      setIsImageLoading(true);
    }, 6000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [total, isInteracting]);

  /*
   * --------------------------------------------------
   * DETECT MANUAL MOBILE SCROLL
   * --------------------------------------------------
   */
  const handleMobileScroll = useCallback(() => {
    if (mobileScrollTimerRef.current) {
      clearTimeout(
        mobileScrollTimerRef.current,
      );
    }

    mobileScrollTimerRef.current =
      setTimeout(() => {
        const container =
          mobileCarouselRef.current;

        if (!container) return;

        const children = Array.from(
          container.children,
        ) as HTMLElement[];

        if (!children.length) return;

        const containerCenter =
          container.scrollLeft +
          container.clientWidth / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        children.forEach((child, index) => {
          const childCenter =
            child.offsetLeft +
            child.offsetWidth / 2;

          const distance = Math.abs(
            childCenter - containerCenter,
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex !== activeIndex) {
          setIsImageLoading(true);
          setActiveIndex(closestIndex);
        }
      }, 120);
  }, [activeIndex]);

  /*
   * --------------------------------------------------
   * CLEANUP
   * --------------------------------------------------
   */
  useEffect(() => {
    return () => {
      if (mobileScrollTimerRef.current) {
        clearTimeout(
          mobileScrollTimerRef.current,
        );
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  /*
   * --------------------------------------------------
   * EMPTY STATE
   * --------------------------------------------------
   */
  if (!total) return null;

  const currentCategory =
    categories[activeIndex];

  /*
   * --------------------------------------------------
   * DESKTOP SIDE PREVIEWS
   * --------------------------------------------------
   */
  const leftPins = [
    categories[
      (activeIndex - 2 + total) % total
    ],
    categories[
      (activeIndex - 1 + total) % total
    ],
  ];

  const rightPins = [
    categories[
      (activeIndex + 1) % total
    ],
    categories[
      (activeIndex + 2) % total
    ],
  ];

  /*
   * --------------------------------------------------
   * RENDER
   * --------------------------------------------------
   */
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-white
        text-gray-900
        select-none
        border-b
        border-gray-100
        py-6
        antialiased
        sm:py-10
      "
      onMouseEnter={() =>
        setIsInteracting(true)
      }
      onMouseLeave={() =>
        setIsInteracting(false)
      }
      onTouchStart={() =>
        setIsInteracting(true)
      }
      onTouchEnd={() =>
        setIsInteracting(false)
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="
              text-xl
              font-bold
              tracking-tight
              text-gray-950
              sm:text-2xl
            "
          >
            Featured Categories
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous category"
              className="
                rounded-full
                border
                border-gray-200
                bg-white
                p-2
                text-gray-600
                transition-all
                hover:border-[#008744]
                hover:text-[#008744]
                active:scale-95
              "
            >
              <ChevronLeft className="size-4" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next category"
              className="
                rounded-full
                border
                border-gray-200
                bg-white
                p-2
                text-gray-600
                transition-all
                hover:border-[#008744]
                hover:text-[#008744]
                active:scale-95
              "
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* DESKTOP CATEGORY STAGE */}
        <div
          className="
            grid
            grid-cols-1
            items-start
            gap-5
            md:grid-cols-12
            lg:gap-8
          "
        >
          {/* LEFT */}
          <div className="hidden flex-col gap-6 md:col-span-3 md:flex">
            {leftPins.map((cat, idx) => {
              if (!cat) return null;

              const categoryIndex =
                categories.findIndex(
                  (item) => item.id === cat.id,
                );

              return (
                <div
                  key={`left-pin-${cat.id}-${idx}`}
                  className="
                    group
                    flex
                    cursor-pointer
                    flex-col
                    items-center
                    text-center
                  "
                  onClick={() =>
                    handleSelect(categoryIndex)
                  }
                >
                  <div
                    className="
                      relative
                      aspect-square
                      w-full
                      overflow-hidden
                      rounded-3xl
                      border
                      border-gray-100
                      bg-gray-50
                      transition-transform
                      duration-300
                      group-hover:scale-[1.02]
                      active:scale-95
                    "
                  >
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="260px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="size-full bg-gray-100" />
                    )}
                  </div>

                  <span
                    className="
                      mt-2.5
                      w-full
                      truncate
                      text-xs
                      font-semibold
                      text-gray-700
                      transition-colors
                      group-hover:text-gray-950
                      sm:text-sm
                    "
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* CENTER */}
          <div className="col-span-1 flex flex-col items-center md:col-span-6">
            <Link
              href={`/categories/${currentCategory.slug}`}
              className="
                group
                block
                w-full
                max-w-125
                focus:outline-none
              "
            >
              <div
                className="
                  relative
                  aspect-square
                  w-full
                  overflow-hidden
                  rounded-3xl
                  border
                  border-gray-100
                  bg-gray-50
                  transition-transform
                  duration-500
                  group-hover:scale-[1.01]
                "
              >
                {isImageLoading && (
                  <div
                    className="
                      absolute
                      inset-0
                      z-10
                      flex
                      animate-pulse
                      items-center
                      justify-center
                      bg-gray-100/90
                    "
                  >
                    <Loader2
                      className="
                        size-7
                        animate-spin
                        text-[#008744]
                      "
                    />
                  </div>
                )}

                {currentCategory.imageUrl ? (
                  <Image
                    key={`hero-${currentCategory.id}`}
                    src={currentCategory.imageUrl}
                    alt={currentCategory.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    onLoad={() =>
                      setIsImageLoading(false)
                    }
                    className={`
                      object-cover
                      transition-all
                      duration-500
                      ${
                        isImageLoading
                          ? "scale-95 opacity-0"
                          : "scale-100 opacity-100"
                      }
                    `}
                  />
                ) : (
                  <div
                    className="
                      flex
                      size-full
                      items-center
                      justify-center
                      bg-gray-100
                      text-gray-400
                    "
                  >
                    No Image Available
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col items-center text-center">
                <h3
                  className="
                    text-xl
                    font-bold
                    tracking-tight
                    text-gray-950
                    transition-colors
                    group-hover:text-[#008744]
                    sm:text-2xl
                  "
                >
                  {currentCategory.name}
                </h3>

                <div
                  className="
                    mt-1.5
                    inline-flex
                    items-center
                    gap-1.5
                    text-xs
                    font-semibold
                    text-[#008744]
                    sm:text-sm
                  "
                >
                  <span>
                    Explore Collection
                  </span>

                  <ArrowRight
                    className="
                      size-4
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="hidden flex-col gap-6 md:col-span-3 md:flex">
            {rightPins.map((cat, idx) => {
              if (!cat) return null;

              const categoryIndex =
                categories.findIndex(
                  (item) => item.id === cat.id,
                );

              return (
                <div
                  key={`right-pin-${cat.id}-${idx}`}
                  className="
                    group
                    flex
                    cursor-pointer
                    flex-col
                    items-center
                    text-center
                  "
                  onClick={() =>
                    handleSelect(categoryIndex)
                  }
                >
                  <div
                    className="
                      relative
                      aspect-square
                      w-full
                      overflow-hidden
                      rounded-3xl
                      border
                      border-gray-100
                      bg-gray-50
                      transition-transform
                      duration-300
                      group-hover:scale-[1.02]
                      active:scale-95
                    "
                  >
                    {cat.imageUrl ? (
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="260px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="size-full bg-gray-100" />
                    )}
                  </div>

                  <span
                    className="
                      mt-2.5
                      w-full
                      truncate
                      text-xs
                      font-semibold
                      text-gray-700
                      transition-colors
                      group-hover:text-gray-950
                      sm:text-sm
                    "
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE CATEGORY CAROUSEL */}
        <div className="mt-7 md:hidden">
          <div className="relative">

            {/* Left fade */}
            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                left-0
                z-10
                w-8
                bg-linear-to-r
                from-white
                to-transparent
              "
            />

            {/* Right fade */}
            <div
              className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                z-10
                w-8
                bg-linear-to-l
                from-white
                to-transparent
              "
            />

            <div
              ref={mobileCarouselRef}
              onScroll={handleMobileScroll}
              className="
                flex
                items-center
                gap-4
                overflow-x-auto
                snap-x
                snap-mandatory
                scrollbar-none
                px-[calc(50vw-75px)]
                py-5
                touch-pan-x
                overscroll-x-contain
              "
              style={{
                WebkitOverflowScrolling: "touch",
              }}
            >
              {categories.map((cat, index) => {
                const isActive =
                  index === activeIndex;

                return (
                  <button
                    key={`mobile-category-${cat.id}`}
                    ref={(element) => {
                      mobileCardRefs.current[
                        cat.id
                      ] = element;
                    }}
                    type="button"
                    onClick={() =>
                      handleSelect(index)
                    }
                    aria-current={
                      isActive
                        ? "true"
                        : undefined
                    }
                    className="
                      shrink-0
                      snap-center
                      focus:outline-none
                      active:scale-[0.97]
                    "
                  >
                    {/* IMAGE */}
                    <div
                      className={`
                        relative
                        overflow-hidden
                        rounded-[24px]
                        bg-neutral-100
                        transition-all
                        duration-700
                        ease-out
                        ${
                          isActive
                            ? "h-37.5 w-37.5 border-2 border-[#008744] shadow-[0_10px_30px_rgba(0,92,46,0.18)]"
                            : "size-24 border border-neutral-200 opacity-70"
                        }
                      `}
                    >
                      {cat.imageUrl ? (
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          fill
                          sizes={
                            isActive
                              ? "150px"
                              : "96px"
                          }
                          className="
                            object-cover
                            transition-transform
                            duration-700
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            size-full
                            items-center
                            justify-center
                            bg-neutral-100
                          "
                        >
                          <span className="text-xs text-neutral-400">
                            No image
                          </span>
                        </div>
                      )}

                      {/* Active overlay */}
                      {isActive && (
                        <div
                          className="
                            absolute
                            inset-0
                            bg-linear-to-t
                            from-black/35
                            via-transparent
                            to-transparent
                          "
                        />
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <div
                          className="
                            absolute
                            bottom-3
                            left-1/2
                            h-1
                            w-8
                            -translate-x-1/2
                            rounded-full
                            bg-white
                            shadow-sm
                          "
                        />
                      )}
                    </div>

                    {/* NAME */}
                    <div
                      className={`
                        mt-2.5
                        max-w-37.5
                        truncate
                        text-center
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "text-sm font-bold text-[#005c2e]"
                            : "text-[11px] font-medium text-neutral-500"
                        }
                      `}
                    >
                      {cat.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MOBILE INDICATORS */}
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {categories.map((cat, index) => (
              <button
                key={`indicator-${cat.id}`}
                type="button"
                onClick={() =>
                  handleSelect(index)
                }
                aria-label={`Go to ${cat.name}`}
                aria-current={
                  index === activeIndex
                    ? "true"
                    : undefined
                }
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-500
                  ${
                    index === activeIndex
                      ? "w-6 bg-[#008744]"
                      : "w-1.5 bg-neutral-300"
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}