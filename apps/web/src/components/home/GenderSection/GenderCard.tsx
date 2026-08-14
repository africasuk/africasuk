"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface GenderCardProps {
  title: string;
  subtitle: string;
  image: string;
  query: string;
  align?: "left" | "right";
}

export default function GenderCard({
  title,
  subtitle,
  image,
  query,
  align = "left",
}: GenderCardProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
      className="group relative flex h-80 sm:h-96 md:h-105 w-full cursor-pointer overflow-hidden rounded-none border border-gray-200 bg-gray-100 text-left shadow-none transition-colors duration-200 select-none antialiased"
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={title}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-103"
      />

      {/* Contrast Overlay */}
      <div className="absolute inset-0 bg-linear-to-t sm:bg-linear-to-r from-black/75 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

      {/* Content Container */}
      <div
        className={`relative z-10 flex h-full w-full flex-col justify-end p-5 sm:p-7 md:p-8 ${
          align === "right" ? "items-end text-right" : "items-start text-left"
        }`}
      >
        <span className="mb-1.5 text-[11px] sm:text-xs font-normal uppercase tracking-widest text-white/80">
          {subtitle}
        </span>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
          {title}
        </h3>

        {/* Sharp Action Trigger */}
        <div className="mt-4 sm:mt-5 inline-flex items-center gap-2 rounded-none bg-white px-3.5 sm:px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-900 transition-colors duration-150 group-hover:bg-[#004d26] group-hover:text-white shadow-none">
          <span>Shop Now</span>
          <ArrowRight className="h-3.5 w-3.5 stroke-[1.5] transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      </div>
    </button>
  );
}