"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Props {
  images: {
    id: string;
    imageUrl: string | null;
  }[];
}

export function ProductGallery({ images }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Touch & Drag Sliding State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const imagesCount = images?.length ?? 0;

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? imagesCount - 1 : prev - 1));
  }, [imagesCount]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === imagesCount - 1 ? 0 : prev + 1));
  }, [imagesCount]);

  // Keyboard Navigation for Lightbox
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

  // Lock Body Scroll when Lightbox is open
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

  // Touch Swipe Handlers for Mobile Sliding
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  // Safe early return AFTER all React hooks have been invoked
  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 w-full rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
        No image available
      </div>
    );
  }

  const currentImageSrc =
    images[selectedIndex]?.imageUrl &&
    images[selectedIndex].imageUrl.startsWith("http")
      ? images[selectedIndex].imageUrl
      : "/placeholder.png";

  return (
    <>
      {/* 1. MAIN PRODUCT GALLERY DISPLAY */}
      <div className="flex flex-col gap-5 items-center w-full">
        {/* Main Display Container */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full h-105 sm:h-120 lg:h-130 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 cursor-pointer group select-none"
        >
          {/* Main Image */}
          <Image
            src={currentImageSrc}
            alt={`Product view ${selectedIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Click to Zoom Overlay Indicator */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-[#002b15]/90 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-xs transition-all duration-200 shadow-md">
              Click to view full screen ↗
            </span>
          </div>

          {/* Inline Navigation Arrows */}
          {images.length > 1 && (
            <div
              className="absolute bottom-4 right-4 flex items-center gap-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-gray-200 text-gray-800 flex items-center justify-center shadow-xs hover:bg-[#002b15] hover:text-white hover:border-[#002b15] transition-all"
              >
                &#8249;
              </button>
              <button
                onClick={handleNext}
                aria-label="Next image"
                className="w-9 h-9 rounded-full bg-[#002b15] text-white flex items-center justify-center shadow-xs hover:bg-[#002b15]/90 transition-all"
              >
                &#8250;
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Bar */}
        {images.length > 1 && (
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase self-end mr-1">
              PRODUCT VIEW
            </span>
            <div className="flex gap-2.5 overflow-x-auto p-1 max-w-full no-scrollbar">
              {images.map((image, index) => {
                const thumbnailSrc =
                  image.imageUrl && image.imageUrl.startsWith("http")
                    ? image.imageUrl
                    : "/placeholder.png";

                const isSelected = index === selectedIndex;

                return (
                  <button
                    key={image.id}
                    onClick={() => setSelectedIndex(index)}
                    className={`relative h-16 w-16 min-w-16 rounded-xl overflow-hidden bg-gray-50 border-2 transition-all ${
                      isSelected
                        ? "border-[#002b15] ring-2 ring-[#002b15]/20 shadow-xs"
                        : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-200"
                    }`}
                  >
                    <Image
                      src={thumbnailSrc}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. FULL-SCREEN SLIDING LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center select-none animate-in fade-in duration-200">
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 z-50 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 h-10 w-10 rounded-full flex items-center justify-center text-xl transition-all cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 z-50 text-xs font-semibold text-white/70 tracking-widest uppercase bg-white/10 px-3 py-1.5 rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Slidable Screen-Fitting Center View */}
          <div
            className="relative w-full h-full max-w-6xl max-h-[85vh] px-4 sm:px-12 flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative w-full h-full">
              <Image
                src={currentImageSrc}
                alt={`Product detail view ${selectedIndex + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Sliding Control Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous photo"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center text-2xl hover:bg-[#002b15] hover:border-[#002b15] transition-all cursor-pointer"
              >
                &#8249;
              </button>

              <button
                onClick={handleNext}
                aria-label="Next photo"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 h-12 w-12 rounded-full bg-black/40 border border-white/20 text-white flex items-center justify-center text-2xl hover:bg-[#002b15] hover:border-[#002b15] transition-all cursor-pointer"
              >
                &#8250;
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}