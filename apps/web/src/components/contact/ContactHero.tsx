"use client";

import Link from "next/link";
import { ArrowLeft, Headphones } from "lucide-react";

export default function ContactHero() {
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
        <Headphones className="h-4 w-4" />
        <span>Get in Touch</span>
      </div>

      <h1 className="text-3xl font-serif font-bold text-gray-900 sm:text-4xl">
        Contact Us
      </h1>

      <p className="mt-2 text-lg font-semibold tracking-wide text-[#004d26]">
        We&apos;re here to help.
      </p>

      <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
        Whether you have a question about an order, need help finding a product, want to request a product, or simply have feedback, our team is ready to assist you.
      </p>
    </div>
  );
}