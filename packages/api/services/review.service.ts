import type {
  CreateReviewDto,
  Review,
  ReviewStatus,
  UpdateReviewDto,
} from "@africasuk/types";

import {
  OrderItemRepository,
  OrderRepository,
  ReviewRepository,
} from "@africasuk/database";

export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
  ) {}

  /**
   * Create a review after verifying that the user
   * actually purchased the product.
   */
  async createReview(
    userId: string,
    dto: CreateReviewDto,
  ): Promise<Review> {
    // 1. Check that the order exists
    const order = await this.orderRepository.findById(
      dto.orderId,
    );

    if (!order) {
      throw new Error("Order not found.");
    }

    // 2. Make sure the order belongs to the logged-in user
    if (order.userId !== userId) {
      throw new Error(
        "You are not allowed to review this order.",
      );
    }

    // 3. Get all items from the order
    const orderItems =
      await this.orderItemRepository.findByOrder(
        dto.orderId,
      );

    // 4. Find the requested order item
    const orderItem = orderItems.find(
      (item) => item.id === dto.orderItemId,
    );

    if (!orderItem) {
      throw new Error(
        "The product was not found in this order.",
      );
    }

    // 5. Verify product
    if (orderItem.productId !== dto.productId) {
      throw new Error(
        "The product does not match the order item.",
      );
    }

    // 6. Verify variant when supplied
    if (
      dto.variantId &&
      orderItem.variantId !== dto.variantId
    ) {
      throw new Error(
        "The product variant does not match the order item.",
      );
    }

    // 7. Only allow reviews for delivered orders
    if (order.status !== "DELIVERED") {
      throw new Error(
        "You can review a product only after the order has been delivered.",
      );
    }

    // 8. Prevent duplicate reviews
    const existingReview =
      await this.reviewRepository.findByOrderItem(
        dto.orderItemId,
      );

    if (existingReview) {
      throw new Error(
        "You have already reviewed this product.",
      );
    }

    // 9. Create the review
    const review = await this.reviewRepository.create(
      userId,
      dto,
    );

    return review;
  }

  /**
   * Get approved reviews for a product.
   */
  async getProductReviews(
    productId: string,
  ): Promise<Review[]> {
    return this.reviewRepository.findByProduct(
      productId,
      true,
    );
  }

  /**
   * Get the logged-in user's reviews.
   */
  async getUserReviews(
    userId: string,
  ): Promise<Review[]> {
    return this.reviewRepository.findByUser(userId);
  }

  /**
   * Get a single review.
   */
  async getReview(
    id: string,
  ): Promise<Review | null> {
    return this.reviewRepository.findById(id);
  }

  /**
   * Update a user's review.
   */
  async updateReview(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ): Promise<Review> {
    const review =
      await this.reviewRepository.findById(
        reviewId,
      );

    if (!review) {
      throw new Error("Review not found.");
    }

    if (review.userId !== userId) {
      throw new Error(
        "You are not allowed to update this review.",
      );
    }

    return this.reviewRepository.update(
      reviewId,
      dto,
    );
  }

  /**
   * Delete a user's review.
   */
  async deleteReview(
    userId: string,
    reviewId: string,
  ): Promise<void> {
    const review =
      await this.reviewRepository.findById(
        reviewId,
      );

    if (!review) {
      throw new Error("Review not found.");
    }

    if (review.userId !== userId) {
      throw new Error(
        "You are not allowed to delete this review.",
      );
    }

    await this.reviewRepository.delete(reviewId);
  }

  /**
   * Get product rating summary.
   */
  async getProductRating(productId: string) {
    return this.reviewRepository.getProductRating(
      productId,
    );
  }


    /**
 * Get all reviews for admin moderation.
 */
  async getAllReviews(): Promise<Review[]> {
    return this.reviewRepository.findAll();
  }
  /**
   * Admin moderation.
   */
  async moderateReview(
    reviewId: string,
    status: ReviewStatus,
  ): Promise<Review> {
    const review =
      await this.reviewRepository.findById(
        reviewId,
      );

    if (!review) {
      throw new Error("Review not found.");
    }
        return this.reviewRepository.updateStatus(
        reviewId,
        status,
        );
  }

  async adminDeleteReview(
  reviewId: string,
): Promise<void> {
  const review =
    await this.reviewRepository.findById(
      reviewId,
    );

  if (!review) {
    throw new Error("Review not found.");
  }

  await this.reviewRepository.delete(reviewId);
}
}