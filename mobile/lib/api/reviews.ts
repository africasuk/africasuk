import type { Review } from "@africasuk/types";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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

/**
 * Get reviews for a product
 */
export async function getProductReviews(
  productId: string,
  accessToken: string
): Promise<ReviewsResponse> {
  const response = await fetch(
    `${API_URL}/api/reviews?productId=${encodeURIComponent(productId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to fetch reviews.");
  }

  return data;
}

/**
 * Create a product review
 */
export async function createReview(
  review: CreateReviewInput,
  accessToken: string
): Promise<{ review: Review }> {
  const response = await fetch(`${API_URL}/api/reviews`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: review.productId,
      variantId: review.variantId ?? null,
      orderId: review.orderId,
      orderItemId: review.orderItemId,
      rating: review.rating,
      title: review.title?.trim() || null,
      comment: review.comment?.trim() || null,
      images: review.images ?? [],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to submit review.");
  }

  return data;
}