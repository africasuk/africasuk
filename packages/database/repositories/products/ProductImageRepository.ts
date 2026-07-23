import type { ProductImage } from "@africasuk/types";

import type { SupabaseClient } from "@supabase/supabase-js";

export class ProductImageRepository {
  constructor(
    private readonly db: SupabaseClient
  ) {}

  async create(data: {
    productColorId: string;
    imageUrl: string;
    sortOrder: number;
  }): Promise<ProductImage> {
    const { data: image, error } =
      await this.db
        .from("product_images")
        .insert({
          product_color_id:
            data.productColorId,
          image_url: data.imageUrl,
          sort_order: data.sortOrder,
        })
        .select()
        .single();

    if (error) throw error;

    return image;
  }
}