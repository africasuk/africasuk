import Link from "next/link";
import Image from "next/image";
import type { Category } from "@africasuk/types";

interface HeroCategoryCardProps {
  category: Category;
}

export default function HeroCategoryCard({ category }: HeroCategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block w-[180px] sm:w-[220px] aspect-[4/5] shrink-0 overflow-hidden rounded-2xl border border-neutral-200/50 bg-white/60 shadow-md backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#004d26]/40 hover:shadow-xl hover:shadow-green-950/5"
    >
      {/* Category Showcase Image Layer */}
      {category.imageUrl ? (
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 180px, 220px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-100" />
      )}

      {/* Luxury Gradient Darkener Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/90 group-hover:via-black/35" />

      {/* Pinned Bottom Label Element */}
      <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-center z-10">
        <span className="text-xs sm:text-sm font-bold tracking-wider text-white drop-shadow-md line-clamp-2 leading-tight transition-all duration-300 group-hover:text-[#004d26] group-hover:bg-white/95 bg-black/30 backdrop-blur-xs py-1.5 px-3 rounded-xl inline-block w-full">
          {category.name}
        </span>
      </div>
    </Link>
  );
}