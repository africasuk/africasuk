import Image from "next/image";
import Link from "next/link";

import { BrandRepository } from "@africasuk/database";
import { createClient } from "@/lib/auth/server";

import Container from "@/components/layout/Container";
import Layout from "@/components/layout/Layout";

export default async function BrandsPage() {
  const supabase = await createClient();
  const brandRepository = new BrandRepository(supabase);

  const rawBrands = await brandRepository.getAll();
  const brands = rawBrands ?? [];

  return (
    <Layout>
      <section className="w-full py-8 sm:py-14 bg-white min-h-[85vh] antialiased select-none border-b border-gray-100">
        <Container className="max-w-none w-full px-4 sm:px-6 lg:px-12">
          
          {/* Page Header */}
          <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 border-b border-gray-100 pb-5 sm:pb-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950">
                Official Brands
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-2xl">
                Explore authentic collections from our verified global and local partners.
              </p>
            </div>

            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0">
              {brands.length} {brands.length === 1 ? "Brand" : "Brands"}
            </div>
          </div>

          {/* Brands Content */}
          {brands.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 py-16 sm:py-24 text-center select-none">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                No Brands Found
              </h2>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                Brands will appear here once they are added to our partners catalog.
              </p>
            </div>
          ) : (
            /* Pinterest-Style 1:1 Clean Brand Grid */
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-10 gap-4 sm:gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group flex flex-col items-center text-center w-full focus:outline-none transition-transform duration-300 hover:-translate-y-1"
                >
                  {/* 1:1 Soft-Curved Image Container (No Shadows, Clean Borders) */}
                  <div className="relative aspect-square w-full rounded-3xl bg-gray-50/80 border border-gray-100/80 p-4 sm:p-5 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-gray-200">
                    {brand.logoUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={brand.logoUrl}
                          alt={brand.name}
                          fill
                          sizes="(max-width: 640px) 30vw, (max-width: 1024px) 15vw, 120px"
                          quality={90}
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <span className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
                        {brand.name.slice(0, 3)}
                      </span>
                    )}
                  </div>

                  {/* Brand Name Below Card */}
                  <span className="mt-2 text-xs font-semibold text-gray-700 tracking-tight line-clamp-1 w-full group-hover:text-[#008744] transition-colors">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </Layout>
  );
}