"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TermsHero() {
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
        <ShieldCheck className="h-4 w-4" />
        <span>Legal & Policy</span>
      </div>

      <h1 className="text-3xl font-serif font-bold text-gray-900 sm:text-4xl">
        Terms of Service
      </h1>

      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Last Updated: August 2026
      </p>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
        Welcome to AfricaSuk. By accessing or using our website and services, you agree to these Terms of Service. If you do not agree with these terms, please do not use our services.
      </p>
    </div>
  );
}