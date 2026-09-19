import type { Review } from "@africasuk/types";
import { createClient } from "@/lib/auth/client";

export interface ProductRating {
  averageRating: number;
  reviewCount: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  rating: ProductRating;
}

export interface CreateReviewInput {
  productId: string;
  orderId: string;
  orderItemId: string;
  variantId?: string | null;
  rating: number;
  title?: string | null;
  comment?: string | null;
  images?: string[];
}

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
  images: string[] | null;
  status: string;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
};

type OrderRow = {
  id: string;
  user_id: string | null;
  status: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
};

function mapReview(row: ReviewRow): Review {
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
    status: row.status,
    verifiedPurchase: row.verified_purchase,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    reviewerName: undefined,
  } as Review;
}

/**
 * Get reviews for a product.
 */
export async function getProductReviews(
  productId: string,
  _accessToken?: string
): Promise<ReviewsResponse> {
  const supabase = createClient();

  const {
    data: reviewData,
    error: reviewsError,
  } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("status", "APPROVED")
    .order("created_at", { ascending: false });

  if (reviewsError) {
    throw new Error(reviewsError.message);
  }

  const reviews =
    (reviewData ?? []) as unknown as ReviewRow[];

  const {
    data: ratingData,
    error: ratingError,
  } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("status", "APPROVED");

  if (ratingError) {
    throw new Error(ratingError.message);
  }

  const ratings =
    (ratingData ?? []) as unknown as { rating: number }[];

  const reviewCount = ratings.length;

  const averageRating =
    reviewCount > 0
      ? ratings.reduce(
          (sum, review) =>
            sum + Number(review.rating),
          0
        ) / reviewCount
      : 0;

  return {
    reviews: reviews.map(mapReview),
    rating: {
      averageRating,
      reviewCount,
    },
  };
}

/**
 * Get the logged-in user's review for a specific order item.
 *
 * Used to determine whether the ReviewForm should
 * be displayed or the user's existing review should
 * be displayed instead.
 */
export async function getUserReviewForOrderItem(
  orderItemId: string,
  _accessToken?: string
): Promise<Review | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      "Unable to verify your login session."
    );
  }

  if (!user) {
    return null;
  }

  const {
    data: reviewData,
    error: reviewError,
  } = await supabase
    .from("reviews")
    .select("*")
    .eq("order_item_id", orderItemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  if (!reviewData) {
    return null;
  }

  const review =
    reviewData as unknown as ReviewRow;

  return mapReview(review);
}

/**
 * Create a product review.
 */
export async function createReview(
  review: CreateReviewInput,
  _accessToken?: string
): Promise<{ review: Review }> {
  const supabase = createClient();

  // Get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      "Unable to verify your login session."
    );
  }

  if (!user) {
    throw new Error(
      "You must be logged in to review a product."
    );
  }

  // Validate rating
  if (
    typeof review.rating !== "number" ||
    review.rating < 1 ||
    review.rating > 5
  ) {
    throw new Error(
      "Rating must be between 1 and 5."
    );
  }

  // Verify order
  const {
    data: orderData,
    error: orderError,
  } = await supabase
    .from("orders")
    .select("id, user_id, status")
    .eq("id", review.orderId)
    .maybeSingle();

  if (orderError) {
    throw new Error(orderError.message);
  }

  const order =
    orderData as unknown as OrderRow | null;

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.user_id !== user.id) {
    throw new Error(
      "You are not allowed to review this order."
    );
  }

  if (order.status !== "DELIVERED") {
    throw new Error(
      "You can review a product only after the order has been delivered."
    );
  }

  // Verify order item
  const {
    data: orderItemData,
    error: orderItemError,
  } = await supabase
    .from("order_items")
    .select(
      "id, order_id, product_id, variant_id"
    )
    .eq("id", review.orderItemId)
    .eq("order_id", review.orderId)
    .maybeSingle();

  if (orderItemError) {
    throw new Error(orderItemError.message);
  }

  const orderItem =
    orderItemData as unknown as OrderItemRow | null;

  if (!orderItem) {
    throw new Error(
      "The product was not found in this order."
    );
  }

  if (
    orderItem.product_id !== review.productId
  ) {
    throw new Error(
      "The product does not match the order item."
    );
  }

  if (
    review.variantId &&
    orderItem.variant_id !== review.variantId
  ) {
    throw new Error(
      "The product variant does not match the order item."
    );
  }

  // Check duplicate review
  const {
    data: existingReviewData,
    error: existingReviewError,
  } = await supabase
    .from("reviews")
    .select("id")
    .eq("order_item_id", review.orderItemId)
    .maybeSingle();

  if (existingReviewError) {
    throw new Error(
      existingReviewError.message
    );
  }

  const existingReview =
    existingReviewData as unknown as {
      id: string;
    } | null;

  if (existingReview) {
    throw new Error(
      "You have already reviewed this product."
    );
  }

  // Create review
  const reviewInsert = {
    product_id: review.productId,
    variant_id: review.variantId ?? null,
    user_id: user.id,
    order_id: review.orderId,
    order_item_id: review.orderItemId,
    rating: review.rating,
    title: review.title?.trim() || null,
    comment: review.comment?.trim() || null,
    images: review.images ?? [],
    status: "APPROVED",
    verified_purchase: true,
  };

  const {
    data: createdReviewData,
    error: createError,
  } = await (supabase.from("reviews") as any)
    .insert(reviewInsert)
    .select("*")
    .single();

  if (createError) {
    throw new Error(createError.message);
  }

  const createdReview =
    createdReviewData as unknown as ReviewRow;

  return {
    review: mapReview(createdReview),
  };
}