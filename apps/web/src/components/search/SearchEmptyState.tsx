"use client";

import { SearchX, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  q?: string;
}

export function SearchEmptyState({ q }: Props) {
  return (
    <div className="mx-auto max-w-md select-none rounded-2xl border border-zinc-200 bg-white p-8 text-center antialiased shadow-xs sm:p-12">
      {/* Icon Badge */}
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 sm:h-14 sm:w-14">
        <SearchX className="h-6 w-6 text-zinc-400" strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div className="mx-auto space-y-2">
        <h3 className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
          No matching products found
        </h3>

        <p className="text-xs leading-relaxed text-zinc-500 sm:text-sm">
          {q ? (
            <>
              We couldn&apos;t find any results for{" "}
              <span className="font-semibold text-zinc-900">&quot;{q}&quot;</span>.
              Try checking your spelling or searching for a more general term.
            </>
          ) : (
            "We couldn't find any products matching your current filters."
          )}
        </p>

        {/* Action Button */}
        <div className="pt-3">
          <Button
            asChild
            variant="outline"
            className="h-10 cursor-pointer rounded-xl border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-800 transition-all active:scale-[0.985] hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
          >
            <Link href="/search" className="inline-flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5 text-zinc-500" strokeWidth={2} />
              <span>Clear Search Filters</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}