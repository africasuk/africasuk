"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface Props {
  images: {
    id: string;
    imageUrl: string | null;
  }[];
}

export function ProductGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Slide drag/swipe physics
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailRowRef = useRef<HTMLDivElement>(null);

  const imagesCount = images?.length ?? 0;

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? imagesCount - 1 : prev - 1));
  }, [imagesCount]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === imagesCount - 1 ? 0 : prev + 1));
  }, [imagesCount]);

  // Keep active thumbnail in view
  useEffect(() => {
    if (!thumbnailRowRef.current) return;
    const activeThumb = thumbnailRowRef.current.children[
      selectedIndex
    ] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedIndex]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handlePrev, handleNext]);

  // Lock body scroll on Lightbox open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  // Pointer/Touch drag handlers for fluid slider
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
    currentX.current = clientX;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    currentX.current = clientX;
    const diff = clientX - startX.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const threshold = 60;
    const totalDiff = currentX.current - startX.current;

    if (totalDiff < -threshold) {
      handleNext();
    } else if (totalDiff > threshold) {
      handlePrev();
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative flex h-96 w-full select-none items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-xs font-normal text-zinc-400">
        No images available
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full select-none flex-col gap-3 antialiased">
        {/* Main Sliding Viewport */}
        <div
          ref={containerRef}
          className="group relative h-96 w-full cursor-grab overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100/70 sm:h-115 lg:h-130 active:cursor-grabbing"
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
        >
          {/* Continuous Sliding Filmstrip */}
          <div
            className={`flex h-full w-full ${
              isDragging ? "" : "transition-transform duration-300 ease-out"
            }`}
            style={{
              transform: `translateX(calc(-${selectedIndex * 100}% + ${dragOffset}px))`,
            }}
          >
            {images.map((img, idx) => {
              const src =
                img.imageUrl && img.imageUrl.startsWith("http")
                  ? img.imageUrl
                  : "/placeholder.png";

              return (
                <div
                  key={img.id || idx}
                  className="relative h-full w-full shrink-0"
                >
                  <Image
                    src={src}
                    alt={`Product image view ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    draggable={false}
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>

          {/* Fullscreen Expansion Pill */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/80 bg-white/90 text-zinc-700 shadow-xs backdrop-blur-xs transition hover:bg-white hover:text-zinc-900"
            aria-label="View full screen"
          >
            <Maximize2 className="h-4 w-4 stroke-[1.8]" />
          </button>

          {/* Inline Slider Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-700 opacity-0 shadow-xs backdrop-blur-xs transition group-hover:opacity-100 hover:bg-white hover:text-zinc-900 active:scale-95"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4 stroke-2" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-700 opacity-0 shadow-xs backdrop-blur-xs transition group-hover:opacity-100 hover:bg-white hover:text-zinc-900 active:scale-95"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4 stroke-2" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots (Mobile only) */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:hidden">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === selectedIndex
                      ? "w-5 bg-zinc-900"
                      : "w-1.5 bg-zinc-400/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Carousel Row */}
        {images.length > 1 && (
          <div
            ref={thumbnailRowRef}
            className="flex max-w-full gap-2 overflow-x-auto py-1 scroll-smooth no-scrollbar"
          >
            {images.map((image, index) => {
              const thumbnailSrc =
                image.imageUrl && image.imageUrl.startsWith("http")
                  ? image.imageUrl
                  : "/placeholder.png";

              const isSelected = index === selectedIndex;

              return (
                <button
                  type="button"
                  key={image.id || index}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 ${
                    isSelected
                      ? "border-zinc-900 ring-1 ring-zinc-900 shadow-xs"
                      : "border-zinc-200 opacity-60 hover:border-zinc-300 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={thumbnailSrc}
                    alt={`Thumbnail view ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-9999 flex h-screen w-screen select-none flex-col justify-between bg-black/95 p-4 backdrop-blur-md sm:p-6">
            {/* Lightbox Navigation Header */}
            <div className="z-10 flex w-full items-center justify-between">
              <div className="rounded-md border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-semibold tracking-wider text-white">
                {selectedIndex + 1} / {images.length}
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                aria-label="Close fullscreen view"
              >
                <X className="h-4 w-4 stroke-2" />
              </button>
            </div>

            {/* Centered Large Viewport */}
            <div
              className="relative mx-auto flex h-[82vh] w-full max-w-5xl items-center justify-center"
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
            >
              <div className="relative flex h-full w-full items-center justify-center">
                <Image
                  src={images[selectedIndex]?.imageUrl || "/placeholder.png"}
                  alt={`Full detail view ${selectedIndex + 1}`}
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Lightbox Arrow Controls */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="fixed left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 sm:left-8"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 stroke-2" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="fixed right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95 sm:right-8"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 stroke-2" />
                </button>
              </>
            )}

            {/* Bottom Counter Indicator */}
            <div className="flex w-full items-center justify-center pb-2">
              <div className="flex gap-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-200 ${
                      idx === selectedIndex ? "w-6 bg-white" : "w-1.5 bg-white/30"
                    }`}
                    aria-label={`Jump to image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}