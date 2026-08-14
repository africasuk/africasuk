"use client";

import GenderCard from "./GenderCard";

export default function GenderSection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 select-none antialiased">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center space-y-1.5">
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-[#004d26]">
            Featured Collections
          </span>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
            Shop by Gender
          </h2>

          <p className="mx-auto max-w-xl text-xs sm:text-sm text-gray-500 font-normal">
            Discover premium collections carefully selected for men and women.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-3 sm:gap-5 lg:grid-cols-2">
          <GenderCard
            title="Women"
            subtitle="Women's Collection"
            image="/images/home/women.jpg"
            query="women"
            align="left"
          />

          <GenderCard
            title="Men"
            subtitle="Men's Collection"
            image="/images/home/men.jpg"
            query="men"
            align="right"
          />
        </div>
      </div>
    </section>
  );
}