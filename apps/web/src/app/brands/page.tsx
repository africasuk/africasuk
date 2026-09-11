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
      <section className="min-h-[85vh] w-full border-b border-gray-100 bg-white py-8 antialiased select-none sm:py-14">
        <Container className="w-full max-w-none px-4 sm:px-6 lg:px-12">
          {/* Page Header */}
          <div className="mb-8 flex flex-col justify-between gap-3 border-b border-gray-100 pb-5 sm:mb-10 sm:flex-row sm:items-end sm:gap-4 sm:pb-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Popular Brands
              </h1>

              <p className="max-w-2xl text-xs font-normal text-gray-500 sm:text-sm">
                Explore products from popular brands available on Africa Suk.
              </p>
            </div>

            <div className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-gray-400 sm:text-xs">
              {brands.length}{" "}
              {brands.length === 1 ? "Brand" : "Brands"}
            </div>
          </div>

          {/* Brands Content */}
          {brands.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center select-none sm:py-24">
              <h2 className="text-base font-semibold text-gray-800 sm:text-lg">
                No Brands Found
              </h2>

              <p className="mx-auto mt-1 max-w-sm text-xs text-gray-500">
                Brands will appear here as products become available.
              </p>
            </div>
          ) : (
            /* Brand Grid */
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group flex w-full flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 focus:outline-none"
                >
                  {/* Brand Image */}
                  <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl border border-gray-100 bg-white p-1.5 transition-all duration-300 group-hover:border-gray-300 group-hover:shadow-xs sm:p-2">
                    {brand.logoUrl ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={brand.logoUrl}
                          alt={`${brand.name} products on Africa Suk`}
                          fill
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 15vw, 160px"
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-700 sm:text-sm">
                        {brand.name.slice(0, 3)}
                      </span>
                    )}
                  </div>

                  {/* Brand Name */}
                  <span className="mt-1.5 w-full line-clamp-1 text-[11px] font-semibold tracking-tight text-gray-700 transition-colors group-hover:text-[#008744] sm:text-xs">
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