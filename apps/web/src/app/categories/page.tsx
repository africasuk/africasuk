import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryRepository } from "@africasuk/database";
import { createClient } from "@/lib/auth/server";

import Layout from "@/components/layout/Layout";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const categoryRepository = new CategoryRepository(supabase);

  // Guard against potential undefined/null return from database
  const categories = (await categoryRepository.getAll()) ?? [];

  return (
    <Layout>
      <section className="w-full py-8 sm:py-12 bg-white select-none antialiased border-b border-gray-100">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-12">
          {/* Header */}
          <div className="mb-8 border-b border-gray-100 pb-6 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
              Product Departments
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-2xl">
              Browse our curated selection of verified premium brands across all
              product categories.
            </p>
          </div>

          {/* Empty State Fallback */}
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
              <p className="text-base font-semibold text-gray-800">
                No categories found
              </p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm">
                Check back later as we expand our inventory and department
                selections.
              </p>
            </div>
          ) : (
            /* 
              Pinterest Multi-Column Masonry:
              - Items pack tightly from top to bottom and left to right.
              - No empty vertical rows or dead gaps.
              - Supports varied heights/aspects naturally.
            */
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 gap-5 sm:gap-6 [column-fill:balance]">
              {categories.map((category, index) => {
                // Pinterest variety: alternating standard 1:1, slightly taller 4:5, and compact 1:1
                const aspectRatios = [
                  "aspect-square",      // 1:1
                  "aspect-[4/5]",       // Slightly taller feature
                  "aspect-square",      // 1:1
                  "aspect-[3/4]",       // Editorial tall
                  "aspect-square",      // 1:1
                ];
                const currentAspect = aspectRatios[index % aspectRatios.length];

                return (
                  <div
                    key={category.id}
                    className="break-inside-avoid mb-6 w-full"
                  >
                    <Link
                      href={`/categories/${category.slug}`}
                      className="group flex flex-col items-center text-center w-full focus:outline-none transition-transform duration-300 hover:-translate-y-1"
                    >
                      {/* Image Card */}
                      <div
                        className={`relative w-full ${currentAspect} rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-xs transition-shadow duration-300 group-hover:shadow-md`}
                      >
                        {category.imageUrl ? (
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-medium text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Details Below Card */}
                      <div className="mt-2.5 flex flex-col items-center px-1 w-full">
                        <h2 className="text-xs sm:text-sm font-semibold text-gray-900 tracking-tight line-clamp-1 group-hover:text-[#008744] transition-colors">
                          {category.name}
                        </h2>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 group-hover:text-[#008744] transition-colors mt-0.5">
                          <span>Explore</span>
                          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}