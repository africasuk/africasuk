"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() =>
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
      className="group relative flex h-105 w-full cursor-pointer overflow-hidden rounded-3xl bg-neutral-100 text-left shadow-lg"
    >
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

      <div
        className={`relative z-10 flex h-full w-full flex-col justify-end p-8 ${
          align === "right"
            ? "items-end text-right"
            : "items-start text-left"
        }`}
      >
        <span className="mb-2 text-sm font-medium uppercase tracking-[0.25em] text-white/80">
          {subtitle}
        </span>

        <h3 className="text-4xl font-bold text-white md:text-5xl">
          {title}
        </h3>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-all duration-300 group-hover:gap-4">
          Shop Now
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </motion.button>
  );
}