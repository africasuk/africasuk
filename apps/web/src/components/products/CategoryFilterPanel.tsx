
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  X,
  RotateCcw,
} from "lucide-react";

interface CategoryFilterPanelProps {
  children: ReactNode;
  activeFilterCount: number;
  onClear: () => void;
}

export default function CategoryFilterPanel({
  children,
  activeFilterCount,
  onClear,
}: CategoryFilterPanelProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closePanel = () => setOpen(false);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((value) => !value)}
          className={`inline-flex h-11 items-center gap-3 rounded-xl border px-4 text-sm font-semibold transition-all duration-200 ${
            open
              ? "border-[#005c2e] bg-[#005c2e] text-white shadow-lg shadow-green-950/10"
              : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50"
          }`}
        >
          <SlidersHorizontal size={17} />
          <span>Filters</span>

          {activeFilterCount > 0 && (
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                open
                  ? "bg-white text-[#005c2e]"
                  : "bg-[#005c2e] text-white"
              }`}
            >
              {activeFilterCount}
            </span>
          )}

          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 transition hover:text-red-600"
          >
            <RotateCcw size={13} />
            Clear all
          </button>
        )}
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-100">
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close filters"
              onClick={closePanel}
              className="absolute inset-0 h-full w-full bg-black/40 backdrop-blur-[2px]"
            />

            {/* Responsive filter panel */}
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="category-filter-title"
              className="
                absolute inset-x-0 bottom-0
                flex max-h-[88dvh] w-full flex-col
                overflow-hidden rounded-t-3xl
                border border-neutral-200 bg-white
                shadow-[0_-12px_50px_rgba(0,0,0,0.18)]
                animate-in slide-in-from-bottom-4 duration-200
                sm:inset-x-auto sm:bottom-auto
                sm:left-1/2 sm:top-1/2
                sm:max-h-[min(80dvh,680px)]
                sm:w-[min(560px,calc(100vw-32px))]
                sm:-translate-x-1/2 sm:-translate-y-1/2
                sm:rounded-2xl
              "
            >
              {/* Mobile drag handle */}
              <div className="flex shrink-0 justify-center pt-3 sm:hidden">
                <span className="h-1 w-10 rounded-full bg-neutral-300" />
              </div>

              {/* Header */}
              <header className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-100 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <h2
                    id="category-filter-title"
                    className="text-base font-bold tracking-tight text-neutral-900"
                  >
                    Refine your selection
                  </h2>
                  <p className="mt-1 text-xs text-neutral-500">
                    Find the right products for you.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePanel}
                  aria-label="Close filter panel"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <X size={18} />
                </button>
              </header>

              {/* Scrollable filters */}
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-5 py-6 sm:px-6">
                <div className="w-full min-w-0">{children}</div>
              </div>

              {/* Footer */}
              <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-neutral-100 bg-neutral-50 px-5 py-4 pb-[calc(16px+env(safe-area-inset-bottom))] sm:px-6 sm:pb-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900">
                    {activeFilterCount === 0
                      ? "All products"
                      : `${activeFilterCount} active`}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Update your selection
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePanel}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[#005c2e] px-6 text-sm font-semibold text-white transition hover:bg-[#004b25] active:scale-[0.98]"
                >
                  Show results
                </button>
              </footer>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
