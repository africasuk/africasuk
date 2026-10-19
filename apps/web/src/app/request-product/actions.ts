
"use server";

import { randomUUID } from "node:crypto";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function submitProductRequest(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("You must be logged in to submit a product request.");
  }

  const phoneValue = formData.get("phone");
  const descriptionValue = formData.get("description");
  const imageValue = formData.get("image");

  if (
    typeof phoneValue !== "string" ||
    typeof descriptionValue !== "string" ||
    !(imageValue instanceof File) ||
    imageValue.size === 0
  ) {
    throw new Error("Please complete all required fields.");
  }

  const phone = phoneValue.trim();
  const description = descriptionValue.trim();
  const image = imageValue;

  if (!phone || !description) {
    throw new Error("Phone number and description are required.");
  }

  if (phone.length > 30) {
    throw new Error("Please enter a valid phone number.");
  }

  if (description.length > 5000) {
    throw new Error("Description must be 5,000 characters or fewer.");
  }

  if (image.size > MAX_IMAGE_SIZE) {
    throw new Error("Image size must be 5 MB or less.");
  }

  const extension = ALLOWED_IMAGE_TYPES[image.type];

  if (!extension) {
    throw new Error("Upload a JPEG, PNG, WebP, or GIF image.");
  }

  const bucketName = "product-requests";
  const fileName = `${user.id}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Product request image upload failed:", uploadError.message);
    throw new Error("Failed to upload the product image. Please try again.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(fileName);

  const { error: insertError } = await supabase
    .from("product_requests")
    .insert({
      user_id: user.id,
      phone,
      description,
      image_url: publicUrl,
      status: "pending",
      product_link: null,
    });

  if (insertError) {
    console.error("Product request database insert failed:", insertError.message);

    // Remove the uploaded image if saving the request fails.
    const { error: cleanupError } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (cleanupError) {
      console.error("Failed to clean up the uploaded image:", cleanupError.message);
    }

    throw new Error("Failed to save your product request. Please try again.");
  }

  return { success: true };
}
