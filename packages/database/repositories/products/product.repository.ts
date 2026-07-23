import type {
  CreateProductDto,
  Product,
  ProductWithDetails,
} from "@africasuk/types";

import type { SupabaseClient } from "@supabase/supabase-js";

export class ProductRepository {
  constructor(
    private readonly db: SupabaseClient
  ) {}

  async create(
    data: Omit<CreateProductDto, "colors">
  ): Promise<Product> {
    const { data: product, error } =
      await this.db
        .from("products")
        .insert({
          category_id: data.categoryId,
          brand_id: data.brandId,
          name: data.name,
          slug: data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
          description: data.description,
          is_active: data.isActive,
        })
        .select()
        .single();

    if (error) throw error;

    return {
      ...product,
      categoryId: product.category_id,
      brandId: product.brand_id,
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  }

  async getAll() {
    const { data, error } = await this.db
      .from("products")
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        colors:product_colors(
          *,
          images:product_images(*),
          variants:product_variants(*)
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

      return data?.map((product: any) => ({
        ...product,

        allowCod: product.allow_cod,
        allowOnlinePayment:
          product.allow_online_payment,

        categoryId: product.category_id,
        brandId: product.brand_id,
        isActive: product.is_active,
        createdAt: product.created_at,
        updatedAt: product.updated_at,

      colors: (product.colors ?? []).map((color: any) => ({
        ...color,
        productId: color.product_id,
        hexCode: color.hex_code,
        createdAt: color.created_at,
        updatedAt: color.updated_at,

        images: (color.images ?? []).map((image: any) => ({
          ...image,
          productColorId: image.product_color_id,
          imageUrl: image.image_url,
          sortOrder: image.sort_order,
          createdAt: image.created_at,
        })),

        variants: (color.variants ?? []).map((variant: any) => ({
          ...variant,
          productColorId: variant.product_color_id,
          optionName: variant.option_name,
          optionValue: variant.option_value,
          isActive: variant.is_active,
          price: Number(variant.price),
          stock: variant.stock,
          createdAt: variant.created_at,
          updatedAt: variant.updated_at,
        })),
      })),
    }));
  }

  async getById(
    id: string
  ): Promise<ProductWithDetails | null> {
    const { data, error } = await this.db
      .from("products")
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        colors:product_colors(
          *,
          images:product_images(*),
          variants:product_variants(*)
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) return null;

    return {
      ...data,

          allowCod: data.allow_cod,
          allowOnlinePayment:
            data.allow_online_payment,

          categoryId: data.category_id,
          brandId: data.brand_id,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,

      colors: (data.colors ?? []).map((color: any) => ({
        ...color,
        productId: color.product_id,
        hexCode: color.hex_code,
        createdAt: color.created_at,
        updatedAt: color.updated_at,

        images: (color.images ?? []).map((image: any) => ({
          ...image,
          productColorId: image.product_color_id,
          imageUrl: image.image_url,
          sortOrder: image.sort_order,
          createdAt: image.created_at,
        })),

        variants: (color.variants ?? []).map((variant: any) => ({
          ...variant,
          productColorId: variant.product_color_id,
          optionName: variant.option_name,
          optionValue: variant.option_value,
          isActive: variant.is_active,
          price: Number(variant.price),
          stock: variant.stock,
          createdAt: variant.created_at,
          updatedAt: variant.updated_at,
        })),
      })),
    };
  }

  async delete(id: string) {
    const { error } = await this.db
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async update(
    id: string,
    data: {
      categoryId: string;
      brandId: string;
      name: string;
      description: string | null;
      isActive: boolean;
    }
  ) {
    const { error } = await this.db
      .from("products")
      .update({
        category_id: data.categoryId,
        brand_id: data.brandId,
        name: data.name,
        description: data.description,
        is_active: data.isActive,
      })
      .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async getBySlug(
    slug: string
  ): Promise<ProductWithDetails | null> {
    const { data, error } = await this.db
      .from("products")
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        colors:product_colors(
          *,
          images:product_images(*),
          variants:product_variants(*)
        )
      `)
      .eq("slug", slug)
      .single();

    if (error) {
  if (error.code === "PGRST116") {
    return null;
  }

  throw error;
}
    if (!data) return null;
        console.log("SLUG DATA", data);
        return {
          ...data,

          allowCod: data.allow_cod,
          allowOnlinePayment:
            data.allow_online_payment,

          categoryId: data.category_id,
          brandId: data.brand_id,
          isActive: data.is_active,
          createdAt: data.created_at,
          updatedAt: data.updated_at,

          
      colors: (data.colors ?? []).map((color: any) => ({
        ...color,

        productId: color.product_id,
        hexCode: color.hex_code,

        images: (color.images ?? []).map((image: any) => ({
          ...image,
          productColorId: image.product_color_id,
          imageUrl: image.image_url,
          sortOrder: image.sort_order,
        })),

        variants: (color.variants ?? []).map((variant: any) => ({
          ...variant,
          productColorId: variant.product_color_id,
          optionName: variant.option_name,
          optionValue: variant.option_value,
          isActive: variant.is_active,
          price: Number(variant.price),
          stock: variant.stock,
        })),
      })),
    };
    
  }

async updatePaymentSettings(
  id: string,
  data: {
    allowCod?: boolean;
    allowOnlinePayment?: boolean;
  }
): Promise<void> {
  const { error } =
    await this.db
      .from("products")
      .update({
        ...(data.allowCod !== undefined && {
          allow_cod: data.allowCod,
        }),

        ...(data.allowOnlinePayment !== undefined && {
          allow_online_payment:
            data.allowOnlinePayment,
        }),
      })
      .eq("id", id);

  if (error) throw error;
}

async search(
  query: string
) {
  const { data, error } =
    await this.db.rpc(
      "search_products",
      {
        search_query: query,
      }
    );

  if (error) {
    throw error;
  }

  return data ?? [];
}
}