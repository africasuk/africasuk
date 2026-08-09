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
      <section className="py-12 sm:py-16 bg-white min-h-screen antialiased select-none border-b border-gray-100">
        <Container>
          {/* Page Header */}
          <div className="mb-10 sm:mb-12 flex items-end justify-between gap-4 border-b border-gray-100 pb-8">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
                Official Brands
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-normal max-w-2xl">
                Explore products from our trusted global and local partners. Find your favorite brands and browse their complete collections.
              </p>
            </div>

            <p className="text-xs font-semibold text-gray-500">
              {brands.length} {brands.length === 1 ? "Brand" : "Brands"}
            </p>
          </div>

          {/* Brands Grid */}
          {brands.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-24 text-center select-none shadow-none">
              <h2 className="text-lg font-semibold text-gray-800">
                No Brands Found
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
                Brands will appear here once they are added to our partners catalog.
              </p>
            </div>
          ) : (
            /* Category Grid: Optimized responsive column counts and gaps */
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group relative block w-full"
                >
                  <Card className="relative h-28 sm:h-32 w-full rounded-2xl border border-gray-100 bg-gray-50/50 p-4 flex flex-col items-center justify-center transition-all duration-300 hover:bg-white hover:border-[#005c2e]/20 hover:shadow-md">
                    
                    {/* Brand Logo or Fallback Name */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {brand.logoUrl ? (
                        <div className="relative w-full h-12 max-w-30 transition-transform duration-300 group-hover:scale-105">
                          <Image
                            src={brand.logoUrl}
                            alt={brand.name}
                            fill
                            sizes="(max-width: 640px) 40vw, 20vw"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-gray-800 text-center line-clamp-1">
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