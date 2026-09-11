"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CareersHero() {
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
      <div className="mt-6 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#004d26] block">
          Work With Us
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Careers
        </h1>

        <p className="text-lg font-bold text-[#004d26] sm:text-xl">
          We&apos;re building our team as Africa Suk grows.
        </p>

        <p className="mx-auto max-w-2xl text-base text-gray-800 leading-relaxed pt-1">
          Opportunities for talented and motivated people across South Sudan in technology, customer experience, logistics, and operations.
        </p>

        <div className="pt-2">
          <span className="inline-block border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-900">
            Applications Opening Soon
          </span>
        </div>
      </div>
    </div>
  );
}