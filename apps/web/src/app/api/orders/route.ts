import { NextResponse } from "next/server";

import {
  OrderCommandService,
  PaymentService,
} from "@africasuk/api";

import {
  OrderItemRepository,
  OrderRepository,
  PaymentRepository,
  ProductRepository,
  ProductVariantRepository,
} from "@africasuk/database";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase =
      await createServerSupabaseClient();

    const orderService =
      new OrderCommandService(
        new OrderRepository(supabase),
        new OrderItemRepository(supabase),
        new ProductRepository(supabase),
        new ProductVariantRepository(supabase),
      );

    const paymentService =
      new PaymentService(
        new PaymentRepository(supabase),
        orderService,
      );

    const result =
      await paymentService.checkout(
        body,
      );

    return NextResponse.json(result, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to place order.",
      },
      {
        status: 400,
      },
    );
  }
}