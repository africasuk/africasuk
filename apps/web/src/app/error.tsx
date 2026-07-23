"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";
import Container from "@/components/layout/Container";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application Runtime Error:", error);
  }, [error]);

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
          
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 border border-red-100 text-red-600 mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Something Went Wrong
          </h1>
          
          <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
            An unexpected error occurred while processing this interface cycle. Our team has been notified.
          </p>

          {/* Action Row */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => reset()}
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#004d26] px-5 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-[#003b1d] active:scale-98 cursor-pointer"
            >
              <RotateCw className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span>Try Again</span>
            </button>

            {/* Replaced <a> with Next.js <Link /> */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 transition-all duration-200 hover:bg-neutral-50 active:scale-98"
            >
              <Home className="h-4 w-4 text-neutral-400" />
              <span>Return Home</span>
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