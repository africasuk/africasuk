import Image from "next/image";
import Link from "next/link";

import { BrandRepository } from "@africasuk/database";
import { createClient } from "@/lib/auth/server";

import Container from "@/components/layout/Container";
import Layout from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";

export default async function BrandsPage() {
  const supabase = await createClient();

  const brandRepository = new BrandRepository(supabase);

  const rawBrands = await brandRepository.getAll();
  const brands = rawBrands ?? [];

  return (
    <Layout>
      <section className="py-8 sm:py-14 bg-white min-h-[85vh] antialiased select-none border-b border-gray-100">
        {/* Full-width container spanning edge-to-edge on widescreen monitors */}
        <Container className="max-w-none w-full px-3 sm:px-6 lg:px-12">
          
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 border-b border-gray-100 pb-5 sm:pb-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                Official Brands
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-2xl">
                Explore products from our trusted global and local partners. Find your favorite brands and browse their complete collections.
              </p>
            </div>

            <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-400 shrink-0">
              {brands.length} {brands.length === 1 ? "Brand" : "Brands"}
            </div>
          </div>

          {/* Brands Grid */}
          {brands.length === 0 ? (
            <div className="rounded-none border border-dashed border-gray-200 bg-gray-50/50 py-16 sm:py-24 text-center select-none">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                No Brands Found
              </h2>
              <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">
                Brands will appear here once they are added to our partners catalog.
              </p>
            </div>
          ) : (
            /* Widescreen-optimized responsive grid that preserves uniform card size */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-2 sm:gap-3">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group relative block w-full"
                >
                  <Card className="relative h-20 sm:h-24 md:h-28 w-full rounded-none border border-gray-200 bg-gray-50/60 p-3 flex flex-col items-center justify-center transition-colors duration-200 hover:bg-white hover:border-gray-400 shadow-none">
                    
                    {/* Brand Logo or Fallback Name */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {brand.logoUrl ? (
                        <div className="relative w-full h-8 sm:h-10 max-w-24 sm:max-w-28 transition-transform duration-300 group-hover:scale-103">
                          <Image
                            src={brand.logoUrl}
                            alt={brand.name}
                            fill
                            sizes="(max-width: 640px) 40vw, (max-width: 1024px) 25vw, 160px"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center line-clamp-1">
                          {brand.name}
                        </span>
                      )}
                    </div>
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