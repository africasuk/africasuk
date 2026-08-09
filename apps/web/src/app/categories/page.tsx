import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CategoryRepository } from "@africasuk/database";
import { createClient } from "@/lib/auth/server";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/card";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const categoryRepository = new CategoryRepository(supabase);

  // Guard against potential undefined/null return from database
  const categories = (await categoryRepository.getAll()) ?? [];

  return (
    <Layout>
      <section className="py-12 sm:py-16 bg-white select-none antialiased border-b border-gray-100">
        <Container>
          {/* Page Header */}
          <div className="mb-10 sm:mb-12 border-b border-gray-100 pb-8 space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-950">
              Product Departments
            </h1>

            <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl">
              Browse our curated selection of verified premium brands across all
              product categories.
            </p>
          </div>

          {/* Empty State Fallback */}
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
              <p className="text-base font-semibold text-gray-800">
                No categories found
              </p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm">
                Check back later as we expand our inventory and department
                selections.
              </p>
            </div>
          ) : (
            /* Category Grid: Optimized responsive column counts and gaps */
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group relative block w-full"
                >
                  <Card className="relative h-44 sm:h-48 w-full rounded-2xl border border-gray-100 bg-gray-50/50 shadow-xs hover:bg-white hover:border-[#005c2e]/20 hover:shadow-lg transition-all duration-300 overflow-hidden select-none">
                    {/* Full-bleed background image */}
                    {category.imageUrl ? (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 250px"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 font-medium text-xs">
                        No Image
                      </div>
                    )}

                    {/* Elegant bottom gradient overlay */}
                    {/* TAILWIND FIX: Changed bg-gradient-to-t to bg-linear-to-t */}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Content Overlay */}
                    <CardContent className="relative z-10 flex h-full flex-col justify-end p-5 space-y-1">
                      <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white line-clamp-1">
                        {category.name}
                      </h2>

                      <div className="flex items-center gap-1.5 text-white/90">
                        <p className="text-xs font-normal">Explore products</p>
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
}