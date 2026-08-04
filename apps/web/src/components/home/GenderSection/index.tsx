"use client";

import { motion } from "framer-motion";
import GenderCard from "./GenderCard";

export default function GenderSection() {
  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#004d26]">
            Featured Collections
          </span>

          <h2 className="mt-2 sm:mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Shop by Gender
          </h2>

          <p className="mx-auto mt-2 sm:mt-4 max-w-2xl text-xs sm:text-base text-gray-500">
            Discover premium collections carefully selected for men and women.
          </p>
        </div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2"
        >
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
        </motion.div>
      </div>
    </section>
  );
}