import { NextResponse } from "next/server";

import {
  ReviewRepository,
  OrderRepository,
  OrderItemRepository,
} from "@africasuk/database";

import { ReviewService } from "@africasuk/api";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function createReviewService() {
  const supabase = createAdminSupabaseClient();

  return new ReviewService(
    new ReviewRepository(supabase),
    new OrderRepository(supabase),
    new OrderItemRepository(supabase),
  );
}

export async function GET() {
  try {
    const reviewService = createReviewService();

    const reviews =
      await reviewService.getAllReviews();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Admin Get Reviews Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch reviews.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const { reviewId, status } = body;

    if (!reviewId || !status) {
      return NextResponse.json(
        {
          error: "reviewId and status are required.",
        },
        { status: 400 },
      );
    }

    if (
      status !== "APPROVED" &&
      status !== "HIDDEN"
    ) {
      return NextResponse.json(
        {
          error: "Invalid review status.",
        },
        { status: 400 },
      );
    }

    const reviewService = createReviewService();

    const review =
      await reviewService.moderateReview(
        reviewId,
        status,
      );

    return NextResponse.json({ review });
  } catch (error) {
    console.error(
      "Admin Update Review Error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update review.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
) {
  try {
    const body = await request.json();

    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json(
        {
          error: "reviewId is required.",
        },
        { status: 400 },
      );
    }

    const reviewService = createReviewService();

    await reviewService.adminDeleteReview(
      reviewId,
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Admin Delete Review Error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete review.",
      },
      { status: 500 },
    );
  }
}