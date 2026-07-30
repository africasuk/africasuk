 // Adjust to your mobile Supabase client import path

import { supabase } from "@/lib/supabase/client";

export interface RequestProductPayload {
  phone: string;
  description: string;
  imageUri: string;
  imageMimeType?: string;
  fileName?: string;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
}

export async function submitProductRequestMobile({
  phone,
  description,
  imageUri,
  imageMimeType = "image/jpeg",
  fileName,
}: RequestProductPayload): Promise<ApiResponse> {
  try {
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  return {
    success: false,
    error: "Please log in to submit a request.",
  };
}

const user = session.user;

    // 1. Prepare File for React Native -> Supabase Upload
    const ext = fileName?.split(".").pop()?.toLowerCase() || "jpg";
    const storagePath = `${user.id}/${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 7)}.${ext}`;

    const formData = new FormData();
    formData.append("files", {
      uri: imageUri,
      name: storagePath.split("/").pop(),
      type: imageMimeType,
    } as unknown as Blob);

    // 2. Upload Image to Supabase Storage
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/product-requests/${storagePath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          "x-upsert": "false",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Storage upload failed:", errData);
      return { success: false, error: "Failed to upload image. Try again." };
    }

    // 3. Obtain Public Image URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("product-requests").getPublicUrl(storagePath);

    // 4. Insert into `product_requests` table
    const { error: dbError } = await supabase.from("product_requests").insert({
      user_id: user.id,
      phone: phone.trim(),
      description: description.trim(),
      image_url: publicUrl,
      status: "pending",
      product_link: null,
    });

    if (dbError) {
      console.error("Database insert error:", dbError);
      // Attempt rollback/delete file on failure
      await supabase.storage.from("product-requests").remove([storagePath]);
      return { success: false, error: "Failed to save request. Try again." };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in submitProductRequestMobile:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}