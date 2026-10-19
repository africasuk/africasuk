"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface GenderCardProps {
  title: string;
  image: string;
  href: string;
}

export default function GenderCard({
  title,
  image,
  href,
}: GenderCardProps) {
  return (
    <Link
      href={href}
      aria-label={`Shop ${title}`}
      className="group relative flex aspect-4/3 w-full flex-col justify-between overflow-hidden rounded-2xl bg-[#a3a3a3] p-4 text-left transition-all duration-300 hover:shadow-xl select-none antialiased sm:p-5 lg:p-6"
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          priority
          quality={100}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-[#004d26] to-[#008744]" />
      )}

      <div className="relative z-10 flex w-full justify-end">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-[#004d26] sm:h-11 sm:w-11">
          <ArrowUpRight className="h-5 w-5 stroke-2 text-neutral-800 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
        </div>
      </div>

      <div className="relative z-10">
        <span className="inline-block rounded-lg bg-white/90 px-3 py-1.5 text-sm font-bold text-[#004d26] shadow-sm backdrop-blur-sm">
          {title}
        </span>
      </div>
    </Link>
  );
}