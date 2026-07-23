import Image from "next/image";
import Link from "next/link";

import { CategoryRepository } from "@africasuk/database";

import { createClient } from "@/lib/auth/server";

import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default async function CategoriesPage() {
  const supabase =
    await createClient();

  const categoryRepository =
    new CategoryRepository(
      supabase
    );

  const categories =
    await categoryRepository.getAll();

  return (
    <Layout>
      <Container>
        <section className="py-10">
          <div className="mb-10">
            <h1 className="text-4xl font-bold">
              Categories
            </h1>

            <p className="mt-2 text-muted-foreground">
              Browse all product categories.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
              >
                <Card className="group relative h-44 overflow-hidden rounded-2xl border-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  {category.imageUrl && (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-transparent transition-opacity group-hover:from-black/75" />

                  <CardContent className="relative z-10 flex h-full flex-col justify-end p-5">
                    <h2 className="text-lg font-bold text-white">
                      {category.name}
                    </h2>

                    <p className="mt-1 text-sm text-white/80">
                      Explore products
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </Layout>
  );
}