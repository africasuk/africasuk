import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProductWithDetails } from "@africasuk/types";


export class SearchRepository {

  constructor(
    private readonly db: SupabaseClient
  ) {}


  async search(
    query: string
  ): Promise<ProductWithDetails[]> {

    const { data, error } =
      await this.db
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
        `);


    if (error) {
      throw error;
    }


    const search =
      query
        .trim()
        .toLowerCase();


    const results =
      (data ?? [])
        .filter((product: any) => {

          const text = [

            // Product
            product.name,
            product.description,

            // Brand
            product.brand?.name,

            // Category
            product.category?.name,


            // Colors + Variants
            ...(product.colors ?? [])
              .flatMap((color: any) => [

                color.name,

                ...(color.variants ?? [])
                  .flatMap((variant: any) => [
                    variant.option_name,
                    variant.option_value,
                    variant.sku,
                  ]),

              ]),


          ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


          return text.includes(search);

        })


        // Convert database snake_case to frontend camelCase
        .map((product: any) => ({

          ...product,

          categoryId: product.category_id,
          brandId: product.brand_id,
          isActive: product.is_active,

          colors:
            (product.colors ?? [])
              .map((color: any) => ({

                ...color,

                productId: color.product_id,
                hexCode: color.hex_code,


                images:
                  (color.images ?? [])
                    .map((image: any) => ({
                      ...image,

                      productColorId:
                        image.product_color_id,

                      imageUrl:
                        image.image_url,

                      sortOrder:
                        image.sort_order,

                      createdAt:
                        image.created_at,
                    })),


                variants:
                  (color.variants ?? [])
                    .map((variant: any) => ({
                      ...variant,

                      productColorId:
                        variant.product_color_id,

                      optionName:
                        variant.option_name,

                      optionValue:
                        variant.option_value,

                      isActive:
                        variant.is_active,

                      price:
                        Number(variant.price),

                      createdAt:
                        variant.created_at,

                      updatedAt:
                        variant.updated_at,
                    })),

              })),

        }));


    return results as ProductWithDetails[];
  }
}