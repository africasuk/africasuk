import type { SupabaseClient } from "@supabase/supabase-js";

const COLOR_PROFITABILITY_CATEGORIES = new Set([
  "babies",
  "bags",
  "dresses-and-suits",
  "heels",
  "hoodies",
  "pants-and-trousers",
  "shirts",
  "shoes",
  "slides-and-sandals",
  "t-shits",
]);

export type ProfitabilityType = "color" | "variant";

export interface ProductProfitabilityCost {
  id: string;

  colorId: string | null;
  variantId: string | null;

  wholesaleCost: number | null;
  nairobiHandling: number | null;
  transportShare: number | null;
  borderOfficialCost: number | null;
  jubaHandling: number | null;
  packagingCost: number | null;
  deliveryAllowance: number | null;

  notes: string | null;

  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductProfitabilityVariantOption {
  id: string;
  optionName: string;
  optionValue: string;
  price: number;
  stock: number;
  sku: string | null;
  isActive: boolean;
}

export interface ProductProfitabilityVariant {
  id: string;

  profitabilityType: ProfitabilityType;

  productId: string;
  productName: string;

  productColorId: string | null;
  colorName: string | null;

  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;

  imageUrl: string | null;

  /**
   * For variant-level products this is the actual variant price.
   *
   * For color-level products this is the lowest active variant price.
   * This gives the profitability screen a conservative selling-price basis.
   */
  price: number;

  /**
   * Useful for grouped products where sizes/options may have
   * different prices.
   */
  minPrice: number;
  maxPrice: number;

  stock: number;
  sku: string | null;

  optionName: string | null;
  optionValue: string | null;

  isActive: boolean;

  variants: ProductProfitabilityVariantOption[];

  cost: ProductProfitabilityCost | null;
}

export interface UpsertProductProfitabilityCostInput {
  colorId?: string | null;
  variantId?: string | null;

  wholesaleCost: number | null;
  nairobiHandling: number | null;
  transportShare: number | null;
  borderOfficialCost: number | null;
  jubaHandling: number | null;
  packagingCost: number | null;
  deliveryAllowance: number | null;

  notes?: string | null;
  updatedBy?: string | null;
}

export class ProductProfitabilityRepository {
  constructor(
    private readonly db: SupabaseClient
  ) {}

  async getAll(): Promise<ProductProfitabilityVariant[]> {
    const { data, error } = await this.db
      .from("product_variants")
      .select(`
        id,
        product_color_id,
        option_name,
        option_value,
        price,
        stock,
        sku,
        is_active,
        created_at,

        product_colors!inner (
          id,
          name,
          product_id,

          products!inner (
            id,
            name,
            category_id,

            categories (
              id,
              name,
              slug
            )
          ),

          product_images (
            image_url,
            sort_order
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const variants = data ?? [];

    /**
     * Group all database variants by product color.
     *
     * Example:
     *
     * Gray
     *   Size 30
     *   Size 32
     *   Size 34
     *
     * becomes ONE profitability record.
     */
    const colorGroups = new Map<
      string,
      {
        color: any;
        product: any;
        variants: any[];
      }
    >();

    for (const variant of variants) {
            const color = Array.isArray(variant.product_colors)
            ? variant.product_colors[0]
            : variant.product_colors;

            const product = Array.isArray(color?.products)
            ? color.products[0]
            : color?.products;

            if (!color || !product) {
            continue;
            }

            const colorId = color.id;
      const existing = colorGroups.get(colorId);

      if (existing) {
        existing.variants.push(variant);
      } else {
        colorGroups.set(colorId, {
          color,
          product,
          variants: [variant],
        });
      }
    }

    const result: ProductProfitabilityVariant[] = [];

    for (const group of colorGroups.values()) {
      const {
        color,
        product,
        variants: colorVariants,
      } = group;

      const category = product.categories;

      const categorySlug =
        category?.slug?.toLowerCase() ?? null;

      const isColorLevel =
        categorySlug !== null &&
        COLOR_PROFITABILITY_CATEGORIES.has(categorySlug);

      const images = this.sortImages(
        color?.product_images ?? []
      );

      const imageUrl =
        images[0]?.image_url ?? null;

      if (isColorLevel) {
        /**
         * CLOTHING / SHOES
         *
         * One profitability record per product color.
         *
         * Example:
         *
         * Cargo Pants — Gray
         * Sizes: 30, 32, 34, 36, 38, 40
         *
         * Cost is attached to color_id.
         */
        const activeVariants = colorVariants.filter(
          (variant) => variant.is_active
        );

        const prices = activeVariants
          .map((variant) => Number(variant.price))
          .filter((price) => Number.isFinite(price));

        const minPrice =
          prices.length > 0
            ? Math.min(...prices)
            : 0;

        const maxPrice =
          prices.length > 0
            ? Math.max(...prices)
            : 0;

        const stock = colorVariants.reduce(
          (total, variant) =>
            total + Number(variant.stock ?? 0),
          0
        );

        const isActive = colorVariants.some(
          (variant) => variant.is_active
        );

        const sortedVariants = [...colorVariants].sort(
          (a, b) => {
            const aValue = String(
              a.option_value ?? ""
            );

            const bValue = String(
              b.option_value ?? ""
            );

            return aValue.localeCompare(
              bValue,
              undefined,
              {
                numeric: true,
                sensitivity: "base",
              }
            );
          }
        );

        const firstVariant =
          sortedVariants[0] ?? null;

        const cost = await this.getColorCost(
          color.id
        );

        result.push({
          id: color.id,

          profitabilityType: "color",

          productId: product.id,
          productName: product.name,

          productColorId: color.id,
          colorName: color.name ?? null,

          categoryId:
            product.category_id ?? category?.id ?? null,

          categoryName:
            category?.name ?? null,

          categorySlug,

          imageUrl,

          /**
           * Conservative price used by the current
           * profitability calculations.
           */
          price: minPrice,

          minPrice,
          maxPrice,

          stock,

          sku: null,

          optionName:
            firstVariant?.option_name ?? null,

          optionValue: null,

          isActive,

          variants: sortedVariants.map(
            (variant) => ({
              id: variant.id,
              optionName: variant.option_name,
              optionValue: variant.option_value,
              price: Number(variant.price),
              stock: Number(variant.stock ?? 0),
              sku: variant.sku,
              isActive: variant.is_active,
            })
          ),

          cost,
        });

        continue;
      }

      /**
       * ELECTRONICS / PHONES / LAPTOPS / CAR / ETC.
       *
       * Every actual variant remains its own
       * profitability record.
       */
      for (const variant of colorVariants) {
        const cost = await this.getVariantCost(
          variant.id
        );

        result.push({
          id: variant.id,

          profitabilityType: "variant",

          productId: product.id,
          productName: product.name,

          productColorId: color.id,
          colorName: color.name ?? null,

          categoryId:
            product.category_id ?? category?.id ?? null,

          categoryName:
            category?.name ?? null,

          categorySlug,

          imageUrl,

          price: Number(variant.price),

          minPrice: Number(variant.price),
          maxPrice: Number(variant.price),

          stock: Number(variant.stock ?? 0),

          sku: variant.sku,

          optionName: variant.option_name,
          optionValue: variant.option_value,

          isActive: variant.is_active,

          variants: [
            {
              id: variant.id,
              optionName: variant.option_name,
              optionValue: variant.option_value,
              price: Number(variant.price),
              stock: Number(variant.stock ?? 0),
              sku: variant.sku,
              isActive: variant.is_active,
            },
          ],

          cost,
        });
      }
    }

    return result;
  }

  async getByVariantId(
    variantId: string
  ): Promise<ProductProfitabilityCost | null> {
    const { data, error } = await this.db
      .from("product_costs")
      .select("*")
      .eq("variant_id", variantId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? this.mapCost(data) : null;
  }

  async getByColorId(
    colorId: string
  ): Promise<ProductProfitabilityCost | null> {
    const { data, error } = await this.db
      .from("product_costs")
      .select("*")
      .eq("color_id", colorId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? this.mapCost(data) : null;
  }
  
async upsertCost(
  input: UpsertProductProfitabilityCostInput
): Promise<ProductProfitabilityCost> {
  const hasColor = Boolean(input.colorId);
  const hasVariant = Boolean(input.variantId);

  if (hasColor === hasVariant) {
    throw new Error(
      "Exactly one of colorId or variantId must be provided."
    );
  }

  const payload = {
    color_id: input.colorId ?? null,
    variant_id: input.variantId ?? null,

    wholesale_cost: input.wholesaleCost ?? null,
    nairobi_handling: input.nairobiHandling ?? null,
    transport_share: input.transportShare ?? null,
    border_official_cost:
      input.borderOfficialCost ?? null,
    juba_handling: input.jubaHandling ?? null,
    packaging_cost: input.packagingCost ?? null,
    delivery_allowance:
      input.deliveryAllowance ?? null,

    notes: input.notes ?? null,
    updated_by: input.updatedBy ?? null,
    updated_at: new Date().toISOString(),
  };

  const existingQuery = this.db
    .from("product_costs")
    .select("*");

  const {
    data: existing,
    error: findError,
  } = hasColor
    ? await existingQuery
        .eq("color_id", input.colorId!)
        .maybeSingle()
    : await existingQuery
        .eq("variant_id", input.variantId!)
        .maybeSingle();

  if (findError) {
    throw findError;
  }

  if (existing) {
    const { data, error } = await this.db
      .from("product_costs")
      .update(payload)
      .eq("id", existing.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return this.mapCost(data);
  }

  const { data, error } = await this.db
    .from("product_costs")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return this.mapCost(data);
}

  async updateSellingPrice(
    variantId: string,
    price: number
  ): Promise<void> {
    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new Error(
        "Selling price must be a valid non-negative number."
      );
    }

    const { error } = await this.db
      .from("product_variants")
      .update({
        price,
        updated_at: new Date().toISOString(),
      })
      .eq("id", variantId);

    if (error) {
      throw error;
    }
  }

  private async getColorCost(
    colorId: string
  ): Promise<ProductProfitabilityCost | null> {
    const { data, error } = await this.db
      .from("product_costs")
      .select("*")
      .eq("color_id", colorId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? this.mapCost(data) : null;
  }

  private async getVariantCost(
    variantId: string
  ): Promise<ProductProfitabilityCost | null> {
    const { data, error } = await this.db
      .from("product_costs")
      .select("*")
      .eq("variant_id", variantId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? this.mapCost(data) : null;
  }

  private sortImages(
    images: Array<{
      image_url: string;
      sort_order?: number | null;
    }>
  ) {
    return [...images].sort(
      (a, b) =>
        (a.sort_order ?? 0) -
        (b.sort_order ?? 0)
    );
  }

  private mapCost(
    data: any
  ): ProductProfitabilityCost {
    return {
      id: data.id,

      colorId: data.color_id ?? null,
      variantId: data.variant_id ?? null,

      wholesaleCost:
        this.toNumberOrNull(data.wholesale_cost),

      nairobiHandling:
        this.toNumberOrNull(data.nairobi_handling),

      transportShare:
        this.toNumberOrNull(data.transport_share),

      borderOfficialCost:
        this.toNumberOrNull(
          data.border_official_cost
        ),

      jubaHandling:
        this.toNumberOrNull(data.juba_handling),

      packagingCost:
        this.toNumberOrNull(
          data.packaging_cost
        ),

      deliveryAllowance:
        this.toNumberOrNull(
          data.delivery_allowance
        ),

      notes: data.notes ?? null,

      createdBy: data.created_by ?? null,
      updatedBy: data.updated_by ?? null,

      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private toNumberOrNull(
    value: number | string | null
  ): number | null {
    return value === null
      ? null
      : Number(value);
  }
}