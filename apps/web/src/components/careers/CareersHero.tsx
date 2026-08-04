"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function CareersHero() {
  return (
    <div className="mb-8 border-b border-gray-200 pb-6">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:border-[#004d26] hover:bg-[#004d26] hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Website</span>
      </Link>

      <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#004d26]">
        <Briefcase className="h-4 w-4" />
        <span>Work With Us</span>
      </div>

      <h1 className="text-3xl font-serif font-bold text-gray-900 sm:text-4xl">
        Careers
      </h1>

      <div className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
        <span>Coming Soon</span>
      </div>
    </div>
  );
}