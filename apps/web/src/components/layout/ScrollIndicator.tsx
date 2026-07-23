"use client";

import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 10) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-12 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-1 lg:flex select-none transition-opacity duration-300">
      {/* Top Chevron */}
      <svg 
        className="h-12 w-20 animate-pulse text-[#004d26]/40 [animation-delay:0ms] animation-duration-[1.5s]" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={3.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>

      {/* Middle Chevron */}
      <svg 
        className="h-12 w-20 animate-pulse text-[#004d26]/70 -mt-6 [animation-delay:200ms] animation-duration-[1.5s]" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={3.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>

      {/* Bottom Chevron (Brightest Brand Accent) */}
      <svg 
        className="h-12 w-20 animate-pulse text-[#004d26] -mt-6 [animation-delay:400ms] animation-duration-[1.5s]" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={3.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}