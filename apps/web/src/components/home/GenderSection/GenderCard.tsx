"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

interface GenderCardProps {
  title: string;
  image: string;
  query: string;
}

export default function GenderCard({
  title,
  image,
  query,
}: GenderCardProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(`/search?q=${encodeURIComponent(query)}`)}
      /* aspect-4/3 matches the 1024x768 image dimensions exactly */
      className="group relative flex aspect-4/3 w-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl bg-[#a3a3a3] p-4 sm:p-5 lg:p-6 text-left transition-all duration-300 hover:shadow-xl select-none antialiased"
    >
      {/* Background Graphic - 100% visible, zero pixels cut off */}
      <Image
        src={image}
        alt={title}
        fill
        priority
        quality={100}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />

      {/* Top Right: Pinterest-style Floating Action Button */}
      <div className="relative z-10 flex w-full justify-end">
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-md transition-all duration-300 group-hover:bg-[#004d26] group-hover:text-white group-hover:scale-110">
          <ArrowUpRight className="h-5 w-5 stroke-[2] text-neutral-800 transition-transform duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </button>
  );
}