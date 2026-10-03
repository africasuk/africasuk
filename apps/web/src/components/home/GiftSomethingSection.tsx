"use client";

import Image from "next/image";
import Link from "next/link";

export default function GiftSomethingSection() {
  return (
    <section className="w-full bg-white">
      <div className="relative mx-auto w-full overflow-hidden">
        <div className="relative aspect-video w-full">
          <Image
            src="https://res.cloudinary.com/kwlkw1ta/image/upload/v1791024172/gift_dwwuw7.png"
            alt="Gift something that outlines the celebration"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />

          <Link
            href="/categories/gift"
            aria-label="Shop gifts"
            className="absolute inset-0 z-10"
          />
        </div>
      </div>
    </section>
  );
}