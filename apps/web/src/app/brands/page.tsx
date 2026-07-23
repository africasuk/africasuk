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
      <section className="py-12 lg:py-16 bg-[#f4f4f4] min-h-screen antialiased selection:bg-[#004d26]/10">
        <Container>
          {/* Section Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between px-2 select-none">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
                Brands
              </h1>
              <p className="mt-2 text-sm sm:text-base text-neutral-500 max-w-2xl">
                Explore products from trusted global and local partners. Find your favorite brands and browse their complete collections.
              </p>
            </div>

            <div className="inline-flex items-center self-start sm:self-end rounded-full bg-white border border-neutral-200/60 px-4 py-1.5 text-xs font-bold text-neutral-700 shadow-xs">
              {brands.length} {brands.length === 1 ? "Brand" : "Brands"}
            </div>
          </div>

          {/* Brands Grid */}
          {brands.length === 0 ? (
            <div className="rounded-3xl border border-neutral-200/60 bg-white py-24 text-center select-none shadow-xs">
              <h2 className="text-xl font-extrabold text-neutral-900">
                No Brands Found
              </h2>
              <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto">
                Brands will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group block w-full transition-transform duration-500 ease-out hover:-translate-y-1"
                >
                  <Card className="relative w-full h-full bg-white rounded-2xl border border-neutral-200/60 shadow-xs hover:shadow-lg hover:shadow-neutral-200/50 transition-all duration-500 overflow-hidden flex flex-col justify-between p-4 select-none min-h-55 md:min-h-60">
                    
                    {/* 
                      Luxury Watermark Background Logo:
                      Positions a massive, desaturated logo at low opacity that scales & rotates on hover.
                    */}
                    {brand.logoUrl && (
                      <div className="absolute -right-6 -bottom-6 w-36 h-36 sm:w-44 sm:h-44 opacity-[0.04] sm:opacity-[0.06] pointer-events-none select-none transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-6 z-0">
                        <Image
                          src={brand.logoUrl}
                          alt=""
                          fill
                          className="object-contain filter grayscale"
                          sizes="(max-width: 640px) 144px, 176px"
                        />
                      </div>
                    )}

                    {/* Brand Name & Description Details */}
                    <div className="z-10 max-w-37.5 sm:max-w-xs">
                      <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-neutral-900 group-hover:text-[#004d26] transition-colors duration-300 leading-snug line-clamp-1">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="mt-1 text-[10px] sm:text-xs text-neutral-500 leading-normal sm:leading-relaxed font-medium line-clamp-2">
                          {brand.description}
                        </p>
                      )}
                    </div>

                    {/* Crisp, Forefront Brand Logo */}
                    <div className="relative mt-3 self-end w-12 h-12 sm:w-16 sm:h-16 shrink-0 z-10">
                      {brand.logoUrl ? (
                        <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-rotate-1">
                          <Image
                            src={brand.logoUrl}
                            alt={brand.name}
                            fill
                            sizes="(max-width: 640px) 48px, 64px"
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-full bg-[#004d26]/10 flex items-center justify-center text-sm sm:text-lg font-black text-[#004d26] transition-transform duration-500 group-hover:scale-105">
                          {brand.name.charAt(0).toUpperCase()}
                        </div>
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