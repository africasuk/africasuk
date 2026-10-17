
"use server";

import { revalidatePath } from "next/cache";

import {
  BrandRepository,
  CategoryRepository,
  OrderItemRepository,
  OrderRepository,
  ProductRepository,
  ProductVariantRepository,
} from "@africasuk/database";

import {
  OrderCommandService,
  OrderQueryService,
} from "@africasuk/api";

import type {
  FulfillmentMethod,
  OrderStatus,
  PaymentStatus,
} from "@africasuk/types";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function getOrders() {
  const supabase = createAdminSupabaseClient();

  const service = new OrderQueryService(
    new OrderRepository(supabase),
    new OrderItemRepository(supabase),
    new ProductRepository(supabase),
    new ProductVariantRepository(supabase),
    new BrandRepository(supabase),
    new CategoryRepository(supabase),
  );

  return service.getAllOrders();
}

export async function getOrder(orderNumber: string) {
  const supabase = createAdminSupabaseClient();

  const service = new OrderQueryService(
    new OrderRepository(supabase),
    new OrderItemRepository(supabase),
    new ProductRepository(supabase),
    new ProductVariantRepository(supabase),
    new BrandRepository(supabase),
    new CategoryRepository(supabase),
  );

  return service.getOrder(orderNumber);
}

export async function updateOrder(
  id: string,
  input: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    estimatedDeliveryStart?: string | null;
    estimatedDeliveryEnd?: string | null;
    trackingNumber?: string | null;
    adminNotes?: string | null;
    fulfillmentMethod?: FulfillmentMethod;
    shipping?: number;
  },
) {
  const supabase = createAdminSupabaseClient();

  const service = new OrderCommandService(
    new OrderRepository(supabase),
    new OrderItemRepository(supabase),
    new ProductRepository(supabase),
    new ProductVariantRepository(supabase),
  );

  const updates: typeof input & { total?: number } = {
    ...input,
  };

  if (
    input.fulfillmentMethod !== undefined ||
    input.shipping !== undefined
  ) {
    const { data: currentOrder, error } = await supabase
      .from("orders")
      .select(
        "subtotal, shipping, tax, discount, fulfillment_method",
      )
      .eq("id", id)
      .single();

    if (error || !currentOrder) {
      throw new Error("Could not find the order.");
    }

    const method: FulfillmentMethod =
      input.fulfillmentMethod ??
      currentOrder.fulfillment_method;

    const shipping =
      method === "PICKUP"
        ? 0
        : input.shipping ?? Number(currentOrder.shipping);

    if (!Number.isFinite(shipping) || shipping < 0) {
      throw new Error(
        "Delivery fee must be a valid non-negative amount.",
      );
    }

    const subtotal = Number(currentOrder.subtotal);
    const tax = Number(currentOrder.tax);
    const discount = Number(currentOrder.discount);

    if (
      !Number.isFinite(subtotal) ||
      !Number.isFinite(tax) ||
      !Number.isFinite(discount)
    ) {
      throw new Error("The order totals are invalid.");
    }

    updates.fulfillmentMethod = method;
    updates.shipping = shipping;
    updates.total = Math.round(
      (subtotal + shipping + tax - discount) * 100,
    ) / 100;
  }

  await service.updateOrder(id, updates);

  revalidatePath("/orders");
  revalidatePath("/orders/[orderNumber]", "page");
}
