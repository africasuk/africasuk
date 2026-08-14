"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  q?: string;
}

export function SearchEmptyState({ q }: Props) {
  return (
    <div className="rounded-none border border-dashed border-gray-200 bg-gray-50/50 p-8 sm:p-14 text-center select-none shadow-none">
      {/* Sharp Icon Box */}
      <div className="mx-auto mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-none border border-gray-200 bg-white shadow-none">
        <SearchX className="h-6 w-6 text-gray-400 stroke-[1.5]" />
      </div>

      {/* Text Content */}
      <div className="space-y-1.5 max-w-sm mx-auto">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          No matching products found
        </h3>

        <p className="text-xs text-gray-500 font-normal leading-relaxed">
          {q ? (
            <>
              We couldn&apos;t find anything for{" "}
              <span className="font-medium text-gray-800">&quot;{q}&quot;</span>. Try checking for typos or searching with broader keywords.
            </>
          ) : (
            "We couldn't find any products matching your active filters."
          )}
        </p>

        {/* Clear Action Button */}
        <div className="pt-3.5">
          <Button
            asChild
            variant="outline"
            className="rounded-none border-gray-300 text-xs font-medium text-gray-800 bg-white hover:bg-gray-50 hover:border-gray-400 cursor-pointer h-8 px-4 shadow-none transition-colors"
          >
            <Link href="/search">Clear Search Filters</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}