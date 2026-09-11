"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutHero() {
  return (
    <div className="mb-10 border-b border-gray-300 pb-8">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-start">
        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Website</span>
        </Link>
      </div>

      {/* Centered Large Heading & Subtitle */}
      <div className="mt-6 space-y-3 text-center">
        <span className="block text-xs font-bold uppercase tracking-widest text-[#004d26]">
          Africa Suk
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          About Africa Suk
        </h1>

        <p className="text-lg font-bold text-[#004d26] sm:text-xl">
          Making Shopping Easier in South Sudan
        </p>

        <p className="mx-auto max-w-2xl pt-1 text-base leading-relaxed text-gray-800">
          Africa Suk sources products from regional and international suppliers
          and makes them available to customers in South Sudan through our
          website and mobile app.
        </p>
      </div>
    </div>
  );
}