
import type {
  CreateProductDto,
  Product,
  ProductWithDetails,
} from "@africasuk/types";

import type { SupabaseClient } from "@supabase/supabase-js";

// Raw Supabase response types.
type RawImage = {
  id: string;
  product_color_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  [key: string]: unknown;
};

type RawVariant = {
  id: string;
  product_color_id: string;
  option_name: string;
  option_value: string;
  is_active: boolean;
  price: number | string;
  stock: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
};

type RawColor = {
  id: string;
  product_id: string;
  name: string;
  hex_code: string | null;
  created_at: string;
  updated_at: string;
  images: RawImage[] | null;
  variants: RawVariant[] | null;
  [key: string]: unknown;
};

type RawProduct = {
  id: string;
  name: string;
  category_id: string;
  brand_id: string;
  description: string | null;
  slug: string;
  allow_cod: boolean;
  allow_online_payment: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  colors: RawColor[] | null;
  [key: string]: unknown;
};

type ProductRating = {
  averageRating: number;
  reviewCount: number;
};

// Normalize database colors and their relationships.
function mapColors(colors: RawColor[] | null) {
  return (colors ?? []).map((color) => ({
    ...color,

    productId: color.product_id,
    hexCode: color.hex_code,
    createdAt: color.created_at,
    updatedAt: color.updated_at,

    images: (color.images ?? []).map((image) => ({
      ...image,
      productColorId: image.product_color_id,
      imageUrl: image.image_url,
      sortOrder: image.sort_order,
      createdAt: image.created_at,
    })),

    variants: (color.variants ?? []).map((variant) => ({
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
  }));
}

// Normalize a Supabase product response.
function mapProduct(
  product: RawProduct,
  rating?: ProductRating,
): ProductWithDetails {
  return {
    ...product,

    allowCod: product.allow_cod,
    allowOnlinePayment: product.allow_online_payment,
    categoryId: product.category_id,
    brandId: product.brand_id,
    isActive: product.is_active,
    createdAt: product.created_at,
    updatedAt: product.updated_at,

    ...(rating !== undefined && { rating }),

    colors: mapColors(product.colors),
  } as unknown as ProductWithDetails;
}

export class ProductRepository {
  constructor(
    private readonly db: SupabaseClient
  ) {}

  async create(
    data: Omit<CreateProductDto, "colors">
  ): Promise<Product> {
    const { data: product, error } = await this.db
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

  async getAll(options: { random?: boolean } = {}): Promise<ProductWithDetails[]> {
    let randomIds: string[] = [];

    // Get random product IDs from Supabase.
    if (options.random) {
      const { data: randomData, error: randomError } =
        await this.db.rpc("get_random_product_ids", {
          p_limit: 1000,
        });

      if (randomError) throw randomError;

      randomIds = (
        (randomData ?? []) as { product_id: string }[]
      ).map((item) => item.product_id);

      if (randomIds.length === 0) return [];
    }

    const productQuery = this.db
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

    const { data, error } = options.random
      ? await productQuery.in("id", randomIds)
      : await productQuery.order("created_at", {
          ascending: false,
        });

    if (error) throw error;

    const products = (data ?? []) as unknown as RawProduct[];

    if (products.length === 0) return [];

    // Restore the random order returned by the RPC.
    const orderedProducts = options.random
      ? [...products].sort(
          (a, b) =>
            randomIds.indexOf(a.id) -
            randomIds.indexOf(b.id)
        )
      : products;

    // Get approved reviews.
    const productIds = orderedProducts.map(
      (product) => product.id
    );

    const {
      data: reviews,
      error: reviewsError,
    } = await this.db
      .from("reviews")
      .select("product_id, rating")
      .in("product_id", productIds)
      .eq("status", "APPROVED");

    if (reviewsError) throw reviewsError;

    // Calculate product ratings.
    const ratingMap = new Map<
      string,
      { total: number; count: number }
    >();

    for (const review of reviews ?? []) {
      const current = ratingMap.get(review.product_id) ?? {
        total: 0,
        count: 0,
      };

      current.total += Number(review.rating);
      current.count += 1;

      ratingMap.set(review.product_id, current);
    }

    return orderedProducts.map((product) => {
      const rating = ratingMap.get(product.id);

      return mapProduct(product, {
        averageRating: rating
          ? Number(
              (rating.total / rating.count).toFixed(1)
            )
          : 0,
        reviewCount: rating?.count ?? 0,
      });
    });
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

    if (error) throw error;

    if (!data) return null;

    return mapProduct(data as unknown as RawProduct);
  }

  async delete(id: string) {
    const { error } = await this.db
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
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

    if (error) throw error;
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

    return mapProduct(data as unknown as RawProduct);
  }

  async updatePaymentSettings(
    id: string,
    data: {
      allowCod?: boolean;
      allowOnlinePayment?: boolean;
    }
  ): Promise<void> {
    const { error } = await this.db
      .from("products")
      .update({
        ...(data.allowCod !== undefined && {
          allow_cod: data.allowCod,
        }),

        ...(data.allowOnlinePayment !== undefined && {
          allow_online_payment: data.allowOnlinePayment,
        }),
      })
      .eq("id", id);

    if (error) throw error;
  }

  async search(query: string) {
    const { data, error } = await this.db.rpc(
      "search_products",
      {
        search_query: query,
      }
    );

    if (error) throw error;

    return data ?? [];
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

    if (error) throw error;
  }
}
