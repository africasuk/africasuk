
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryRepository } from "@africasuk/database";
import { createClient } from "@/lib/auth/server";
import Layout from "@/components/layout/Layout";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const categoryRepository = new CategoryRepository(supabase);
  const categories = (await categoryRepository.getAll()) ?? [];

  return (
    <Layout>
      <section className="w-full select-none bg-white antialiased">
        <div className="w-full px-4 pb-24 pt-20 sm:px-6 sm:pb-10 sm:pt-10 lg:px-10 xl:px-12">
          {/* Page heading */}
          <div className="mb-5 border-b border-gray-100 pb-4 sm:mb-8 sm:pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              Shop by Category
            </h1>
            <p className="mt-1 max-w-2xl text-xs text-gray-500 sm:text-sm">
              Explore fashion, electronics, beauty, home, and everyday
              essentials available on Africa Suk.
            </p>
          </div>

          {/* Empty state */}
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 py-20 text-center">
              <p className="text-base font-semibold text-gray-800">
                No categories found
              </p>
              <p className="mt-1 max-w-sm text-xs text-gray-500 sm:text-sm">
                Check back later as we add more categories to Africa Suk.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile: compact, app-style category grid */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:hidden">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="group min-w-0"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                      {category.imageUrl ? (
                        <Image
                          src={category.imageUrl}
                          alt={`${category.name} products on Africa Suk`}
                          fill
                          sizes="50vw"
                          className="object-cover transition-transform duration-300 group-active:scale-[0.98]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1 px-0.5 pt-2">
                      <h2 className="truncate text-sm font-semibold text-gray-900">
                        {category.name}
                      </h2>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#008744]" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Desktop: retain the masonry layout */}
              <div className="hidden columns-2 gap-5 sm:block sm:columns-3 sm:gap-6 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-7 [column-fill:balance]">
                {categories.map((category, index) => {
                  const aspectRatios = [
                    "aspect-square",
                    "aspect-[4/5]",
                    "aspect-square",
                    "aspect-[3/4]",
                    "aspect-square",
                  ];
                  const currentAspect =
                    aspectRatios[index % aspectRatios.length];

                  return (
                    <div
                      key={category.id}
                      className="mb-6 w-full break-inside-avoid"
                    >
                      <Link
                        href={`/categories/${category.slug}`}
                        className="group flex w-full flex-col items-center text-center outline-none transition-transform duration-300 hover:-translate-y-1"
                      >
                        <div
                          className={`relative w-full ${currentAspect} overflow-hidden rounded-3xl border border-gray-100 bg-gray-50 shadow-xs transition-shadow duration-300 group-hover:shadow-md`}
                        >
                          {category.imageUrl ? (
                            <Image
                              src={category.imageUrl}
                              alt={`${category.name} products on Africa Suk`}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs font-medium text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="mt-2.5 flex w-full flex-col items-center px-1">
                          <h2 className="line-clamp-1 text-xs font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-[#008744] sm:text-sm">
                            {category.name}
                          </h2>
                          <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-gray-500 transition-colors group-hover:text-[#008744]">
                            <span>Explore</span>
                            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
