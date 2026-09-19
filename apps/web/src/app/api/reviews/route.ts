import { NextResponse } from "next/server";
import {
  ReviewRepository,
  OrderRepository,
  OrderItemRepository,
} from "@africasuk/database";
import { ReviewService } from "@africasuk/api";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const productId = searchParams.get("productId");
    const orderItemId = searchParams.get("orderItemId");

    const supabase = await createServerSupabaseClient();

    /*
     * -------------------------------------------------------
     * CHECK WHETHER THE CURRENT USER ALREADY REVIEWED
     * THIS ORDER ITEM
     * -------------------------------------------------------
     */
    if (orderItemId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { review: null },
          { status: 200 },
        );
      }

      const { data: review, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("order_item_id", orderItemId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(
          "Check Existing Review Error:",
          error,
        );

        return NextResponse.json(
          {
            error: "Failed to check existing review.",
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        review: review
          ? {
              id: review.id,
              rating: review.rating,
              title: review.title,
              comment: review.comment,
              verifiedPurchase:
                review.verified_purchase,
              createdAt: review.created_at,
            }
          : null,
      });
    }

    /*
     * -------------------------------------------------------
     * GET PRODUCT REVIEWS
     * -------------------------------------------------------
     */
    if (!productId) {
      return NextResponse.json(
        {
          error:
            "productId or orderItemId is required.",
        },
        { status: 400 },
      );
    }

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

export async function POST(request: Request) {
  try {
    const supabase =
      await createServerSupabaseClient();

    /*
     * -------------------------------------------------------
     * AUTHENTICATION
     * -------------------------------------------------------
     */
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to review a product.",
        },
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

    /*
     * -------------------------------------------------------
     * REQUIRED FIELDS
     * -------------------------------------------------------
     */
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

    /*
     * -------------------------------------------------------
     * RATING VALIDATION
     * -------------------------------------------------------
     */
    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          error:
            "Rating must be between 1 and 5.",
        },
        { status: 400 },
      );
    }

    /*
     * -------------------------------------------------------
     * DUPLICATE REVIEW CHECK
     * -------------------------------------------------------
     */
    const { data: existingReview, error: duplicateError } =
      await supabase
        .from("reviews")
        .select("id")
        .eq("order_item_id", orderItemId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (duplicateError) {
      console.error(
        "Duplicate Review Check Error:",
        duplicateError,
      );

      return NextResponse.json(
        {
          error:
            "Failed to check existing review.",
        },
        { status: 500 },
      );
    }

    if (existingReview) {
      return NextResponse.json(
        {
          error:
            "You have already reviewed this purchase.",
        },
        { status: 409 },
      );
    }

    /*
     * -------------------------------------------------------
     * CREATE REVIEW
     * -------------------------------------------------------
     */
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
    console.error(
      "Create Review Error:",
      error,
    );

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