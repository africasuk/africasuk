import { NextResponse } from "next/server";

import {
  ReviewRepository,
  OrderRepository,
  OrderItemRepository,
} from "@africasuk/database";

import { ReviewService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
) {
  try {
    const { searchParams } = new URL(request.url);

    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required." },
        { status: 400 },
      );
    }

    const supabase =
      await createServerSupabaseClient();

    const reviewService = new ReviewService(
      new ReviewRepository(supabase),
      new OrderRepository(supabase),
      new OrderItemRepository(supabase),
    );

    const reviews =
      await reviewService.getProductReviews(
        productId,
      );

    const rating =
      await reviewService.getProductRating(
        productId,
      );

    return NextResponse.json({
      reviews,
      rating,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

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

export async function POST(
  request: Request,
) {
  try {
    const supabase =
      await createServerSupabaseClient();

    // Get currently authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to review a product." },
        { status: 401 },
      );
    }

    const body = await request.json();

    const {
      productId,
      variantId,
      orderId,
      orderItemId,
      rating,
      title,
      comment,
      images,
    } = body;

    if (
      !productId ||
      !orderId ||
      !orderItemId ||
      rating === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "productId, orderId, orderItemId and rating are required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          error: "Rating must be between 1 and 5.",
        },
        { status: 400 },
      );
    }

    const reviewService = new ReviewService(
      new ReviewRepository(supabase),
      new OrderRepository(supabase),
      new OrderItemRepository(supabase),
    );

    const review =
      await reviewService.createReview(
        user.id,
        {
          productId,
          variantId: variantId ?? null,
          orderId,
          orderItemId,
          rating,
          title: title ?? null,
          comment: comment ?? null,
          images: Array.isArray(images)
            ? images
            : [],
        },
      );

    return NextResponse.json(
      { review },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Review Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create review.",
      },
      { status: 500 },
    );
  }
}