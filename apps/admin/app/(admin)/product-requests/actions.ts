"use server";

import { revalidatePath } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function updateProductRequestStatus(
  id: string,
  status: string,
  productLink: string | null = null,
) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from("product_requests")
    .update({
      status,
      product_link: productLink,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  revalidatePath("/product-requests");

  return {
    success: true,
  };
}