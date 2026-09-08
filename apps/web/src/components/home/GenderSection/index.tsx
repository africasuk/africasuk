"use client";

import GenderCard from "./GenderCard";

export default function GenderSection() {
  return (
    <section className="w-full py-8 sm:py-12 lg:py-14 select-none antialiased">
      <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#004d26]">
            Featured Collections
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900">
            Shop by Gender
          </h2>

          <p className="mx-auto max-w-xl text-xs sm:text-sm text-gray-500 font-normal">
            Discover premium collections carefully selected for men and women.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
          <GenderCard
            title="Women's Collection"
            image="/images/home/women.jpg"
            query="women"
          />

          <GenderCard
            title="Men's Collection"
            image="/images/home/men.jpg"
            query="men"
          />
        </div>
      </div>
    </section>
  );
}