"use client";

import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default function OrdersButton() {
  return (
    <Link
      href="/account/orders/"
      className="group flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:text-[#004d26] active:scale-95"
      aria-label="Orders"
    >
      <ClipboardList className="h-5 w-5 transition-transform group-hover:scale-105" />
      <span className="text-[10px] font-medium tracking-wide transition-colors group-hover:text-[#004d26]">
        Orders
      </span>
    </Link>
  );
}