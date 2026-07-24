import type { ProductColor } from "@africasuk/types";

import type { SupabaseClient } from "@supabase/supabase-js";

export class ProductColorRepository {
  constructor(
    private readonly db: SupabaseClient
  ) {}

  async create(data: {
    productId: string;
    name: string;
    hexCode?: string | null;
  }): Promise<ProductColor> {
    const { data: color, error } =
      await this.db
        .from("product_colors")
        .insert({
          product_id: data.productId,
          name: data.name,
          hex_code: data.hexCode,
        })
        .select()
        .single();

    if (error) throw error;

    return {
      ...color,
      productId: color.product_id,
      hexCode: color.hex_code,
      createdAt: color.created_at,
      updatedAt: color.updated_at,
    };
  }

  async updateStatus(
  id: string,
  isActive: boolean
): Promise<void> {
  const { error } = await this.db
    .from("products")
    .update({
      is_active: isActive,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }
}

async deleteByProductId(productId: string) {
  const { data: colors, error } =
    await this.db
      .from("product_colors")
      .select("id")
      .eq("product_id", productId);

  if (error) throw error;

  const colorIds =
    colors?.map((color) => color.id) ?? [];


  if (colorIds.length > 0) {

    const { error: variantError } =
      await this.db
        .from("product_variants")
        .delete()
        .in(
          "product_color_id",
          colorIds
        );

    if (variantError) throw variantError;


    const { error: imageError } =
      await this.db
        .from("product_images")
        .delete()
        .in(
          "product_color_id",
          colorIds
        );

    if (imageError) throw imageError;


    const { error: colorError } =
      await this.db
        .from("product_colors")
        .delete()
        .in(
          "id",
          colorIds
        );

    if (colorError) throw colorError;
  }
}
}