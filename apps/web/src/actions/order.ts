"use server";

import type { PlaceOrderRequest } from "@africasuk/types";

import {
  ExchangeRateRepository,
  OrderItemRepository,
  OrderRepository,
  PaymentRepository,
  ProductRepository,
  ProductVariantRepository,
} from "@africasuk/database";

import {
  ExchangeRateService,
  OrderCommandService,
  PaymentService,
} from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function placeOrder(request: PlaceOrderRequest) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }

  // Require an explicit fulfillment selection.
  if (
    request.fulfillmentMethod !== "PICKUP" &&
    request.fulfillmentMethod !== "DELIVERY"
  ) {
    throw new Error(
      "Please select Home Delivery or Meet at an Agreed Location before placing your order.",
    );
}

  // Get the exchange rate currently set by admin.
  const exchangeRateService = new ExchangeRateService(
    new ExchangeRateRepository(supabase),
  );

  const currentRate = await exchangeRateService.getCurrent();

  if (!currentRate?.rate) {
    throw new Error("Current exchange rate is not available.");
  }

  const exchangeRate = currentRate.rate;

  const orderService = new OrderCommandService(
    new OrderRepository(supabase),
    new OrderItemRepository(supabase),
    new ProductRepository(supabase),
    new ProductVariantRepository(supabase),
  );

  const paymentService = new PaymentService(
    new PaymentRepository(supabase),
    orderService,
  );

  // Preserve the selected fulfillment method when creating the order.
  const result = await paymentService.checkout({
    ...request,
    fulfillmentMethod: request.fulfillmentMethod,
    userId: user.id,
  });

  // Send confirmation email using the current admin exchange rate.
  void fetch(
    "https://www.africasuk.com/api/email/order-confirmation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order: result.order,
        customer: request.customer,
        items: request.items ?? [],
        exchangeRate,
      }),
    },
  ).catch((error) => {
    console.error("Order confirmation email failed:", error);
  });

  return result;
}