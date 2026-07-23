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
  OrderStatus,
  PaymentStatus,
} from "@africasuk/types";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function getOrders() {
  const supabase =
    createAdminSupabaseClient();

const service =
  new OrderQueryService(
    new OrderRepository(supabase),
    new OrderItemRepository(supabase),
    new ProductRepository(supabase),
    new ProductVariantRepository(supabase),
    new BrandRepository(supabase),
    new CategoryRepository(supabase),
  );

  return service.getAllOrders();
}

export async function getOrder(
  orderNumber: string,
) {
  const supabase =
    createAdminSupabaseClient();

const service =
  new OrderQueryService(
    new OrderRepository(supabase),
    new OrderItemRepository(supabase),
    new ProductRepository(supabase),
    new ProductVariantRepository(supabase),
    new BrandRepository(supabase),
    new CategoryRepository(supabase),
  );

  return service.getOrder(
    orderNumber,
  );
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
  },
) {
  const supabase =
    createAdminSupabaseClient();

  const service =
    new OrderCommandService(
      new OrderRepository(supabase),
      new OrderItemRepository(supabase),
      new ProductRepository(supabase),
      new ProductVariantRepository(supabase),
    );

  await service.updateOrder(
    id,
    input,
  );

  revalidatePath("/orders");
  revalidatePath("/orders/[orderNumber]", "page");
}