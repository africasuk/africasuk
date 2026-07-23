"use server";

import type {
  PlaceOrderRequest,
} from "@africasuk/types";

import {
  OrderItemRepository,
  OrderRepository,
  PaymentRepository,
  ProductRepository,
  ProductVariantRepository,
} from "@africasuk/database";

import {
  MTNMomoService,
  OrderCommandService,
  PaymentService,
} from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function placeOrder(
  request: PlaceOrderRequest,
) {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "You must be signed in.",
    );
  }

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
      new MTNMomoService(),
    );

  return paymentService.checkout({
    ...request,
    userId: user.id,
  });
}