"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ProductWithDetails } from "@africasuk/types";
import { ProductCard } from "./ProductCard";

interface Props {
  products: ProductWithDetails[];
}

export function RelatedProducts({
  products,
}: Props) {
  const sliderRef =
    useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] =
    useState(false);

  const [canScrollRight, setCanScrollRight] =
    useState(false);

  /*
   * -----------------------------------------
   * CHECK SCROLL POSITION
   * -----------------------------------------
   */

  const updateScrollState = useCallback(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const maxScroll =
      slider.scrollWidth -
      slider.clientWidth;

    setCanScrollLeft(
      slider.scrollLeft > 5
    );

    setCanScrollRight(
      slider.scrollLeft <
        maxScroll - 5
    );
  }, []);

  /*
   * -----------------------------------------
   * SCROLL
   * -----------------------------------------
   */

  const slide = useCallback(
    (direction: "left" | "right") => {
      const slider = sliderRef.current;

      if (!slider) return;

      /*
       * Move approximately 4 products
       * on desktop and fewer on mobile.
       */
      const cardWidth =
        slider.querySelector(
          "[data-product-card]"
        )?.clientWidth ?? 220;

      const gap = 16;

      const cardsPerMove =
        window.innerWidth < 640
          ? 2
          : window.innerWidth < 1024
            ? 3
            : 4;

      const amount =
        (cardWidth + gap) *
        cardsPerMove;

      slider.scrollBy({
        left:
          direction === "right"
            ? amount
            : -amount,
        behavior: "smooth",
      });
    },
    []
  );

  /*
   * -----------------------------------------
   * INITIAL / RESIZE
   * -----------------------------------------
   */

  useEffect(() => {
    updateScrollState();

    const slider =
      sliderRef.current;

    if (!slider) return;

    slider.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateScrollState
    );

    return () => {
      slider.removeEventListener(
        "scroll",
        updateScrollState
      );

      window.removeEventListener(
        "resize",
        updateScrollState
      );
    };
  }, [
    products.length,
    updateScrollState,
  ]);

  /*
   * -----------------------------------------
   * EMPTY
   * -----------------------------------------
   */

  if (!products.length) {
    return null;
  }

  return (
    <section className="w-full">
      {/* ---------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------- */}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2
            className="
              text-xl
              font-bold
              tracking-tight
              text-gray-950
              sm:text-2xl
            "
          >
            Related Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            More products you may like
          </p>
        </div>

        {/* Desktop arrows */}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() =>
              slide("left")
            }
            disabled={!canScrollLeft}
            aria-label="Previous products"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-gray-200
              bg-white
              text-gray-700
              shadow-sm
              transition-all
              hover:border-[#008744]
              hover:bg-[#008744]
              hover:text-white
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-35
              disabled:hover:border-gray-200
              disabled:hover:bg-white
              disabled:hover:text-gray-700
            "
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              slide("right")
            }
            disabled={!canScrollRight}
            aria-label="Next products"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-gray-200
              bg-white
              text-gray-700
              shadow-sm
              transition-all
              hover:border-[#008744]
              hover:bg-[#008744]
              hover:text-white
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-35
              disabled:hover:border-gray-200
              disabled:hover:bg-white
              disabled:hover:text-gray-700
            "
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* SLIDER */}
      {/* ---------------------------------- */}

      <div className="relative w-full">
        <div
          ref={sliderRef}
          className="
            flex
            w-full
            flex-nowrap
            items-stretch
            gap-3
            overflow-x-scroll
            overscroll-x-contain
            scroll-smooth
            snap-x
            snap-mandatory
            px-1
            pb-5
            scrollbar-none
            touch-pan-x
            sm:gap-4
          "
          style={{
            WebkitOverflowScrolling:
              "touch",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              data-product-card
              className="
                w-38.75
                min-w-38.75
                max-w-38.75
                shrink-0
                snap-start
                sm:w-47.5
                sm:min-w-47.5
                sm:max-w-47.5
                md:w-52.5
                md:min-w-52.5
                md:max-w-52.5
                lg:w-55
                lg:min-w-55
                lg:max-w-55
              "
            >
              <ProductCard
                product={product}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* MOBILE SWIPE HINT */}
      {/* ---------------------------------- */}

      <div className="mt-1 flex items-center justify-center sm:hidden">
        <span className="text-[11px] font-medium text-gray-400">
          Swipe to see more
        </span>
      </div>
    </section>
  );
}