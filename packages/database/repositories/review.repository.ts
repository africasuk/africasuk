import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreateReviewDto,
  Review,
  ReviewStatus,
  UpdateReviewDto,
} from "@africasuk/types";

type ReviewRow = {
  id: string;

  product_id: string;
  variant_id: string | null;

  user_id: string;
  order_id: string;
  order_item_id: string;

  rating: number;
  title: string | null;
  comment: string | null;

  images: string[];

  verified_purchase: boolean;
  status: ReviewStatus;

  created_at: string;
  updated_at: string;
};

export class ReviewRepository {
  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

  private mapReview(row: ReviewRow): Review {
    return {
      id: row.id,

      productId: row.product_id,
      variantId: row.variant_id,

      userId: row.user_id,
      orderId: row.order_id,
      orderItemId: row.order_item_id,

      rating: Number(row.rating),
      title: row.title,
      comment: row.comment,

      images: row.images ?? [],

      verifiedPurchase: row.verified_purchase,
      status: row.status,

      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findById(id: string): Promise<Review | null> {
    const { data, error } = await this.supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;

    return data
      ? this.mapReview(data as ReviewRow)
      : null;
  }

async findAll() {
  const { data, error } = await this.supabase
    .from("reviews")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  const reviews = data ?? [];

  if (reviews.length === 0) {
    return [];
  }

  const userIds = [
    ...new Set(
      reviews.map((review) => review.user_id),
    ),
  ];

  const { data: profiles, error: profilesError } =
    await this.supabase
      .from("profiles")
      .select("user_id, full_name, email")
      .in("user_id", userIds);

  if (profilesError) throw profilesError;

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [
      profile.user_id,
      profile,
    ]),
  );

  return reviews.map((row) => {
    const profile = profileMap.get(row.user_id);

    return {
      ...this.mapReview(row as ReviewRow),

      reviewer: {
        name:
          profile?.full_name ??
          "Unknown User",

        email:
          profile?.email ??
          "No email",
      },
    };
  });
}

async findByProduct(
  productId: string,
  approvedOnly = true,
): Promise<Review[]> {
  let query = this.supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", {
      ascending: false,
    });

  if (approvedOnly) {
    query = query.eq("status", "APPROVED");
  }

  const { data, error } = await query;

  if (error) throw error;

  const reviews = data ?? [];

  if (reviews.length === 0) {
    return [];
  }

  // Get buyer IDs
  const userIds = [
    ...new Set(
      reviews.map((review) => review.user_id),
    ),
  ];

  // Get buyer names
  const { data: profiles, error: profilesError } =
    await this.supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

  if (profilesError) throw profilesError;

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [
      profile.user_id,
      profile.full_name,
    ]),
  );

  return reviews.map((row) => ({
    ...this.mapReview(row as ReviewRow),

    reviewerName:
      profileMap.get(row.user_id) ??
      "Verified Buyer",
  }));
}

  async findByUser(userId: string): Promise<Review[]> {
    const { data, error } = await this.supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((row) =>
      this.mapReview(row as ReviewRow),
    );
  }

  async findByOrderItem(
    orderItemId: string,
  ): Promise<Review | null> {
    const { data, error } = await this.supabase
      .from("reviews")
      .select("*")
      .eq("order_item_id", orderItemId)
      .maybeSingle();

    if (error) throw error;

    return data
      ? this.mapReview(data as ReviewRow)
      : null;
  }

async create(
  userId: string,
  dto: CreateReviewDto,
): Promise<Review> {

  const insertData = {
    product_id: dto.productId,
    variant_id: dto.variantId ?? null,

    user_id: userId,
    order_id: dto.orderId,
    order_item_id: dto.orderItemId,

    rating: dto.rating,
    title: dto.title ?? null,
    comment: dto.comment ?? null,

    images: dto.images ?? [],

    status: "APPROVED",
    verified_purchase: true,
  };

  const { data, error } = await this.supabase
    .from("reviews")
    .insert(insertData)
    .select("*")
    .single();

  if (error) throw error;

  return this.mapReview(data as ReviewRow);
}

  async update(
    id: string,
    dto: UpdateReviewDto,
  ): Promise<Review> {
    const { data, error } = await this.supabase
      .from("reviews")
      .update({
        ...(dto.rating !== undefined && {
          rating: dto.rating,
        }),

        ...(dto.title !== undefined && {
          title: dto.title,
        }),

        ...(dto.comment !== undefined && {
          comment: dto.comment,
        }),

        ...(dto.images !== undefined && {
          images: dto.images,
        }),

        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return this.mapReview(data as ReviewRow);
  }

  async updateStatus(
    id: string,
    status: ReviewStatus,
    verifiedPurchase?: boolean,
  ): Promise<Review> {
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (verifiedPurchase !== undefined) {
      updateData.verified_purchase = verifiedPurchase;
    }

    const { data, error } = await this.supabase
      .from("reviews")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return this.mapReview(data as ReviewRow);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async getProductRating(productId: string): Promise<{
    averageRating: number;
    reviewCount: number;
  }> {
    const reviews = await this.findByProduct(productId);

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        reviewCount: 0,
      };
    }

    const total = reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );

    return {
      averageRating: Number(
        (total / reviews.length).toFixed(1),
      ),
      reviewCount: reviews.length,
    };
  }
}