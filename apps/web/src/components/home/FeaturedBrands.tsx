"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import type { Brand } from "@africasuk/types";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

interface Props {
  brands: (Brand & { description?: string })[];
}

export default function FeaturedBrands({ brands = [] }: Props) {
  const [isNavigatingAll, setIsNavigatingAll] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const animationRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);

  const lastXRef = useRef(0);
  const startXRef = useRef(0);
  const positionRef = useRef(0);
  const lastTimeRef = useRef(0);

  const displayBrands = brands;

  useEffect(() => {
    const track = trackRef.current;

    if (!track || displayBrands.length < 2) {
      return;
    }

    const speed = 0.04;

    const animate = (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isDraggingRef.current) {
        positionRef.current -= delta * speed;

        const halfWidth = track.scrollWidth / 2;

        if (halfWidth > 0 && Math.abs(positionRef.current) >= halfWidth) {
          positionRef.current += halfWidth;
        }

        track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = null;
      lastTimeRef.current = 0;
    };
  }, [displayBrands.length]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button or touch
    if (event.button !== 0 && event.pointerType === "mouse") return;

    const slider = sliderRef.current;
    if (!slider) return;

    isDraggingRef.current = true;
    didDragRef.current = false;

    startXRef.current = event.clientX;
    lastXRef.current = event.clientX;
    lastTimeRef.current = 0; // Reset animation timestamp so it doesn't jump on release

    slider.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;

    if (!track || !isDraggingRef.current) {
      return;
    }

    const currentX = event.clientX;
    const difference = currentX - lastXRef.current;

    if (Math.abs(currentX - startXRef.current) > 5) {
      didDragRef.current = true;
    }

    positionRef.current += difference;
    lastXRef.current = currentX;

    const halfWidth = track.scrollWidth / 2;

    if (halfWidth > 0) {
      if (positionRef.current > 0) {
        positionRef.current -= halfWidth;
      } else if (Math.abs(positionRef.current) >= halfWidth) {
        positionRef.current += halfWidth;
      }
    }

    track.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const slider = sliderRef.current;

    isDraggingRef.current = false;
    lastTimeRef.current = 0;

    if (slider && slider.hasPointerCapture(event.pointerId)) {
      slider.releasePointerCapture(event.pointerId);
    }
  };

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      didDragRef.current = false;
    }
  };

  const handleAllBrandsNavigation = () => {
    setIsNavigatingAll(true);
  };

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden bg-white py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              Shop by brand
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Featured Brands
            </h2>

            <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
              Discover products from brands available on AfricaSuk.
            </p>
          </div>

          <Link
            href="/brands"
            onClick={handleAllBrandsNavigation}
            className="hidden shrink-0 sm:block"
          >
            <Button
              type="button"
              variant="outline"
              disabled={isNavigatingAll}
              className="gap-2"
            >
              {isNavigatingAll ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  View All
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </Link>
        </div>

        {/* Infinite Draggable Slider */}
        <div
          ref={sliderRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          className="w-full cursor-grab active:cursor-grabbing select-none overflow-hidden touch-none"
        >
          <div
            ref={trackRef}
            className="flex w-max items-center"
            style={{
              willChange: "transform",
            }}
          >
            {/* First copy */}
            <div className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14">
              {displayBrands.map((brand) => (
                <Link
                  key={`brand-${brand.id}`}
                  href={`/brands/${brand.slug}`}
                  onClick={handleBrandClick}
                  onDragStart={(e) => e.preventDefault()}
                  aria-label={brand.name}
                  className="group relative flex h-20 w-36 shrink-0 items-center justify-center opacity-85 transition-opacity duration-200 hover:opacity-100 sm:h-24 sm:w-44"
                >
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="pointer-events-none object-contain grayscale contrast-200 transition-transform duration-200 group-hover:scale-105"
                      draggable={false}
                    />
                  ) : (
                    <span className="pointer-events-none flex size-full items-center justify-center text-xl font-bold tracking-tight text-black sm:text-2xl">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Second copy */}
            <div
              aria-hidden="true"
              className="flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14"
            >
              {displayBrands.map((brand) => (
                <Link
                  key={`brand-copy-${brand.id}`}
                  href={`/brands/${brand.slug}`}
                  tabIndex={-1}
                  onClick={handleBrandClick}
                  onDragStart={(e) => e.preventDefault()}
                  aria-label={brand.name}
                  className="group relative flex h-20 w-36 shrink-0 items-center justify-center opacity-85 transition-opacity duration-200 hover:opacity-100 sm:h-24 sm:w-44"
                >
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 144px, 176px"
                      className="pointer-events-none object-contain grayscale contrast-200 transition-transform duration-200 group-hover:scale-105"
                      draggable={false}
                    />
                  ) : (
                    <span className="pointer-events-none flex size-full items-center justify-center text-xl font-bold tracking-tight text-black sm:text-2xl">
                      {brand.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View All */}
        <div className="mt-6 sm:hidden">
          <Link
            href="/brands"
            onClick={handleAllBrandsNavigation}
            className="block"
          >
            <Button
              type="button"
              variant="outline"
              disabled={isNavigatingAll}
              className="w-full gap-2"
            >
              {isNavigatingAll ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  View All Brands
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}