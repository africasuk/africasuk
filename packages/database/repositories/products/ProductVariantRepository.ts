
import type { ProductVariant } from "@africasuk/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type VariantInput = {
  productColorId: string;
  optionName: string;
  optionValue: string;
  price: number;
  stock: number;
  sku?: string | null;
  isActive?: boolean;
};

export class ProductVariantRepository {
  constructor(private readonly db: SupabaseClient) {}

  async getById(id: string): Promise<ProductVariant | null> {
    const { data: variant, error } = await this.db
      .from("product_variants")
      .select(`
        *,
        productColor:product_colors(
          *,
          images:product_images(*)
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }

    return {
      ...variant,
      productColorId: variant.product_color_id,
      optionName: variant.option_name,
      optionValue: variant.option_value,
      isActive: variant.is_active,
      price: Number(variant.price),
      stock: variant.stock,
      createdAt: variant.created_at,
      updatedAt: variant.updated_at,
      productColor: {
        ...variant.productColor,
        images:
          variant.productColor?.images?.map((image: any) => ({
            ...image,
            imageUrl: image.image_url,
          })) ?? [],
      },
    } as ProductVariant;
  }

  async create(data: VariantInput): Promise<ProductVariant> {
    const { data: variant, error } = await this.db
      .from("product_variants")
      .insert({
        product_color_id: data.productColorId,
        option_name: data.optionName,
        option_value: data.optionValue,
        price: data.price,
        stock: data.stock,
        sku: data.sku ?? null,
        is_active: data.isActive ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...variant,
      productColorId: variant.product_color_id,
      optionName: variant.option_name,
      optionValue: variant.option_value,
      isActive: variant.is_active,
      price: Number(variant.price),
      stock: variant.stock,
      createdAt: variant.created_at,
      updatedAt: variant.updated_at,
    } as ProductVariant;
  }

  async createMany(
    variants: VariantInput[]
  ): Promise<ProductVariant[]> {
    if (variants.length === 0) return [];

    const { data, error } = await this.db
      .from("product_variants")
      .insert(
        variants.map((variant) => ({
          product_color_id: variant.productColorId,
          option_name: variant.optionName,
          option_value: variant.optionValue,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku ?? null,
          is_active: variant.isActive ?? true,
        }))
      )
      .select();

    if (error) throw error;

    return data.map((variant) => ({
      ...variant,
      productColorId: variant.product_color_id,
      optionName: variant.option_name,
      optionValue: variant.option_value,
      isActive: variant.is_active,
      price: Number(variant.price),
      stock: variant.stock,
      createdAt: variant.created_at,
      updatedAt: variant.updated_at,
    })) as ProductVariant[];
  }

  async decreaseStock(id: string, quantity: number): Promise<void> {
    const { data: variant, error } = await this.db
      .from("product_variants")
      .select("stock")
      .eq("id", id)
      .single();

    if (error) throw error;

    const { error: updateError } = await this.db
      .from("product_variants")
      .update({ stock: variant.stock - quantity })
      .eq("id", id);

    if (updateError) throw updateError;
  }
}
