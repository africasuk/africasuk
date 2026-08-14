"use client";

import { useState, useEffect, useCallback } from "react";
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

  if (!images || images.length === 0) {
    return (
      <div className="relative h-96 w-full rounded-none bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-normal select-none">
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
      <div className="flex flex-col gap-3 w-full select-none antialiased">
        {/* Main Display Container */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full h-100 sm:h-120 lg:h-130 rounded-none bg-gray-50 overflow-hidden border border-gray-200 cursor-pointer group"
        >
          {/* Main Image */}
          <Image
            src={currentImageSrc}
            alt={`Product view ${selectedIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-102"
          />

          {/* Click to Zoom Indicator */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-[#004d26]/90 text-white text-[11px] font-normal px-3 py-1.5 rounded-none transition-all duration-150 flex items-center gap-1.5 shadow-none">
              <Maximize2 className="h-3 w-3 stroke-[1.5]" />
              Click for full screen
            </span>
          </div>

          {/* Inline Navigation Arrows */}
          {images.length > 1 && (
            <div
              className="absolute bottom-3 right-3 flex items-center gap-1 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous image"
                className="w-8 h-8 rounded-none bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transition-colors cursor-pointer shadow-none"
              >
                <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next image"
                className="w-8 h-8 rounded-none bg-[#004d26] text-white flex items-center justify-center hover:bg-[#00361a] transition-colors cursor-pointer shadow-none"
              >
                <ChevronRight className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail Row */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto py-1 max-w-full no-scrollbar">
            {images.map((image, index) => {
              const thumbnailSrc =
                image.imageUrl && image.imageUrl.startsWith("http")
                  ? image.imageUrl
                  : "/placeholder.png";

              const isSelected = index === selectedIndex;

              return (
                <button
                  type="button"
                  key={image.id}
                  onClick={() => setSelectedIndex(index)}
                  className={`relative h-16 w-16 min-w-16 rounded-none overflow-hidden bg-gray-50 border transition-colors cursor-pointer ${
                    isSelected
                      ? "border-[#004d26]"
                      : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400"
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
        )}
      </div>

      {/* 2. FULL-SCREEN LIGHTBOX MODAL */}
      {isLightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-9999 bg-black/95 flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-150 overflow-hidden w-screen h-screen top-0 left-0">
            {/* Top Bar: Counter & Close Button */}
            <div className="w-full flex items-center justify-between z-10">
              <div className="text-[11px] font-normal text-white/80 bg-white/10 px-2.5 py-1 rounded-none border border-white/10">
                {selectedIndex + 1} / {images.length}
              </div>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 h-8 w-8 rounded-none border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close full screen"
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>

            {/* Center Image */}
            <div
              className="relative w-full h-[82vh] sm:h-[86vh] max-w-7xl mx-auto flex items-center justify-center my-auto px-2 sm:px-12"
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

            {/* Controls */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photo"
                  className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-none bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-[#004d26] hover:border-[#004d26] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5 stroke-[1.5]" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photo"
                  className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-none bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-[#004d26] hover:border-[#004d26] transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5 stroke-[1.5]" />
                </button>
              </>
            )}
          </div>,
          document.body
        )}
    </>
  );
}