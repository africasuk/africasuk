"use client";

import Link from "next/link";
import { WifiOff, RotateCw, Home } from "lucide-react";
import Container from "@/components/layout/Container";

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white text-neutral-800 antialiased select-none relative overflow-hidden px-4">
      
      {/* Signature Brand Accent Line */}
      <div className="absolute top-0 left-0 h-1 w-full bg-[#002b15] overflow-hidden">
        <div 
          className="absolute inset-0 w-[200%] h-full bg-linear-to-r from-transparent via-[#00cc66] to-transparent animate-[shimmer_6s_infinite_linear]"
          style={{ backgroundSize: '50% 100%' }}
        />
      </div>

      <Container>
        <div className="max-w-md mx-auto text-center flex flex-col items-center">
          
          {/* Animated/Styled Network Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-50 border border-neutral-100 text-neutral-400 mb-6">
            <WifiOff className="h-8 w-8 text-neutral-500 animate-pulse" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Connection Lost
          </h1>
          
          <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
            We are having trouble connecting to the AfricasUK servers. Please check your network connection and try reloading the interface.
          </p>

          {/* Action Row */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => window.location.reload()}
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#004d26] px-5 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#003b1d] active:scale-98 cursor-pointer"
            >
              <RotateCw className="h-4 w-4 transition-transform group-hover:rotate-45" />
              <span>Retry Connection</span>
            </button>

            {/* Replaced <a> with Next.js <Link /> */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all duration-200 hover:bg-neutral-50 active:scale-98"
            >
              <Home className="h-4 w-4 text-neutral-400" />
              <span>Storefront</span>
            </Link>
          </div>

          {/* Inline Shimmer Keyframes */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes shimmer {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0%); }
            }
          `}} />

        </div>
      </Container>
    </div>
  );
}