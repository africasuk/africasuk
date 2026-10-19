"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@africasuk/types";

interface GreenSectionDividerProps {
  categories: Category[];
}

export default function GreenSectionDivider({
  categories,
}: GreenSectionDividerProps) {
  const items = [
    {
      title: "Shoes",
      slug: "shoes",
    },
    {
      title: "Hand Bags",
      slug: "womens-luxury-bags",
    },
  ]
    .map((item) => ({
      ...item,
      category: categories.find(
        (category) => category.slug === item.slug
      ),
    }))
    .filter((item) => item.category);

  if (items.length === 0) return null;

  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-6 lg:px-8">
        {items.map(({ title, category }) => (
          <Link
            key={category!.id}
            href={`/categories/${category!.slug}`}
            aria-label={`Shop ${title}`}
            className="group relative flex aspect-4/3 w-full flex-col justify-between overflow-hidden rounded-2xl bg-gray-100 p-4 transition-all duration-300 hover:shadow-xl sm:p-5 lg:p-6"
          >
            {category!.imageUrl ? (
              <Image
                src={category!.imageUrl}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-[#004d26] to-[#008744]" />
            )}

            <div className="relative z-10 flex justify-end">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md transition-colors group-hover:bg-[#004d26] sm:h-11 sm:w-11">
                <ArrowUpRight className="h-5 w-5 text-neutral-800 group-hover:text-white" />
              </span>
            </div>

            <div className="relative z-10">
              <span className="inline-block rounded-lg bg-white/90 px-3 py-1.5 text-sm font-bold text-[#004d26] shadow-sm">
                {title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}