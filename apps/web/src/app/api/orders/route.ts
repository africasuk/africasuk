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

    // Place order
    const result =
      await paymentService.checkout(body);

    // Send confirmation email using the same email API
    try {
      await fetch(
        `${new URL(request.url).origin}/api/email/order-confirmation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order: result.order,
            customer: body.customer,
            items: body.items ?? [],
            exchangeRate: body.exchangeRate,
          }),
        },
      );
    } catch (emailError) {
      console.error(
        "Order confirmation email failed:",
        emailError,
      );
    }

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