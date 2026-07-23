import { notFound } from "next/navigation";

import {
  ProductRepository,
} from "@africasuk/database";

import {
  ProductQueryService,
} from "@africasuk/api";

import {
  createServerSupabaseClient,
} from "@/lib/supabase/server";

import { ProductDetails } from "@/components/products/ProductDetails";
import Layout from "@/components/layout/Layout";


export default async function ProductDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string }>;
}) {

  const { slug } = await params;
  const { color } = await searchParams;

  const db = await createServerSupabaseClient();

  const service = new ProductQueryService(
    new ProductRepository(db)
  );

  const product = await service.getBySlug(slug);

  if (!product) {
    notFound();
  }


  return (
    <Layout>
    <ProductDetails
      product={product}
      selectedColorId={color}
    />
    </Layout>
  );
}