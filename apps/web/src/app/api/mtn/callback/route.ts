import { NextResponse } from "next/server";

import {
  PaymentWebhookService,
  OrderCommandService,
} from "@africasuk/api";

import {
  PaymentRepository,
  OrderItemRepository,
  OrderRepository,
  ProductRepository,
  ProductVariantRepository,
} from "@africasuk/database";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase =
      await createServerSupabaseClient();

    const orderRepository =
      new OrderRepository(supabase);

    const orderItemRepository =
      new OrderItemRepository(supabase);

    const productRepository =
      new ProductRepository(supabase);

    const variantRepository =
      new ProductVariantRepository(supabase);

    const paymentRepository =
      new PaymentRepository(supabase);

    const orderCommandService =
      new OrderCommandService(
        orderRepository,
        orderItemRepository,
        productRepository,
        variantRepository,
      );

    const webhookService =
      new PaymentWebhookService(
        paymentRepository,
        orderCommandService,
      );

    if (body.status === "SUCCESSFUL") {
      await webhookService.handleSuccessfulPayment(
        body.referenceId,
        body.financialTransactionId,
      );
    }

    if (body.status === "FAILED") {
      await webhookService.handleFailedPayment(
        body.referenceId,
        body.reason,
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Callback failed.",
      },
      {
        status: 500,
      },
    );
  }
}