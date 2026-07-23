import { notFound } from "next/navigation";

import {
  ProductRepository,
} from "@africasuk/database";

import {
  ProductQueryService,
} from "@africasuk/api";

import {
  createAdminSupabaseClient,
} from "@/lib/supabase/admin";

import {
  ProductDetails,
} from "@/components/products/ProductDetails";


interface Props {
  params: Promise<{
    id: string;
  }>;
}


export default async function ProductDetailsPage({
  params,
}: Props) {

  const { id } = await params;

  const db = createAdminSupabaseClient();

  const service = new ProductQueryService(
    new ProductRepository(db)
  );


  const product = await service.getById(id);


  if (!product) {
    notFound();
  }


  return (
    <ProductDetails product={product} />
  );
}