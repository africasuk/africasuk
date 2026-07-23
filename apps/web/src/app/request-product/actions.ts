"use server";

import { randomUUID } from "node:crypto";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function submitProductRequest(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const phone = formData.get("phone") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as File;

  if (!phone || !description || !image || image.size === 0) {
    throw new Error("Please complete all required fields.");
  }

  const extension = image.name.split(".").pop();
  const fileName = `${user.id}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("product-requests")
    .upload(fileName, image);

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("product-requests")
    .getPublicUrl(fileName);

  const { error } = await supabase
    .from("product_requests")
    .insert({
      user_id: user.id,
      phone,
      description,
      image_url: publicUrl,
      status: "pending",
      product_link: null,
    });

  if (error) {
    throw error;
  }

  return {
    success: true,
  };
}