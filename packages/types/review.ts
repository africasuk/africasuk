export type ReviewStatus =
  | "APPROVED"
  | "HIDDEN";

export interface Review {
  id: string;

  productId: string;
  variantId: string | null;

  userId: string;
  orderId: string;
  orderItemId: string;

  rating: number;
  title: string | null;
  comment: string | null;

  images: string[];

  verifiedPurchase: boolean;

  status: ReviewStatus;

  // Public product page
  reviewerName?: string;

  // Admin panel only
  reviewer?: {
    name: string;
    email: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewDto {
  productId: string;
  variantId?: string | null;

  orderId: string;
  orderItemId: string;

  rating: number;
  title?: string | null;
  comment?: string | null;

  images?: string[];
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string | null;
  comment?: string | null;
  images?: string[];
}