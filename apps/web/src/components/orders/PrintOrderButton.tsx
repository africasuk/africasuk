"use client";

import { Printer } from "lucide-react";

export function PrintOrderButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-2 border border-zinc-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98] print:hidden cursor-pointer"
      title="Print Order Receipt"
    >
      <Printer className="h-3.5 w-3.5 text-zinc-600" />
      <span>Print Order</span>
    </button>
  );
}