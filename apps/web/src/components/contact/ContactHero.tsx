"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ContactHero() {
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
          Get in Touch
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Contact Us
        </h1>

        <p className="text-lg font-bold text-[#004d26] sm:text-xl">
          We&apos;re here to help.
        </p>

        <p className="mx-auto max-w-2xl text-base text-gray-800 leading-relaxed pt-1">
          Whether you have a question about an order, need help finding a
          product, want to request a product, or simply have feedback, our team
          is ready to assist you.
        </p>
      </div>
    </div>
  );
}