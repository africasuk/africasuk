"use client";

import GenderCard from "./GenderCard";

export default function GenderSection() {
  return (
    <section className="w-full py-8 antialiased select-none sm:py-12 lg:py-14">
      <div className="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 space-y-1.5 text-center sm:mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#004d26]">
            Shop by Category
          </span>

          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
            Shop by Gender
          </h2>

          <p className="mx-auto max-w-xl text-xs font-normal text-gray-500 sm:text-sm">
            Explore products for women and men available on Africa Suk.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-8">
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