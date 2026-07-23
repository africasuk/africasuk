"use client";

import { SearchX, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  q?: string;
}

export function SearchEmptyState({ q }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-b from-card to-muted/20 p-8 sm:p-12 text-center shadow-xs backdrop-blur-xs">
      {/* Decorative background glow matching brand colors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full bg-[#004d26]/10 blur-2xl pointer-events-none" />

      {/* Floating Sticker Icon Badge */}
      <div className="relative mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center">
        {/* Animated outer ring */}
        <div className="absolute inset-0 rounded-2xl bg-[#004d26]/10 rotate-6 transition-transform duration-500 hover:rotate-12 animate-pulse" />
        
        {/* Main sticker container */}
        <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-border bg-background shadow-md transition-transform duration-300 hover:scale-105 hover:-rotate-3">
          <SearchX className="h-8 w-8 text-[#004d26] dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110" />
          
          {/* Subtle sparkle accent */}
          <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-500 animate-bounce" />
        </div>
      </div>

      {/* Text Content */}
      <div className="relative z-10 space-y-2 max-w-sm mx-auto">
        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          No matching products found
        </h3>
        
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {q ? (
            <>
              We couldn&apos;t find anything for{" "}
              <span className="font-semibold text-foreground">&quot;{q}&quot;</span>. Try checking for typos or searching with broader terms.
            </>
          ) : (
            "We couldn't find any products matching your active filters."
          )}
        </p>

        {/* Clear Search / Back Action */}
        <div className="pt-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-border hover:bg-accent transition-all duration-200 active:scale-95"
          >
            <Link href="/search">Clear Search Filters</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}