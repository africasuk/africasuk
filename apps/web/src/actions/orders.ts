"use server";

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

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getMyOrders() {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "You must be signed in.",
    );
  }

  const service =
    new OrderQueryService(
      new OrderRepository(
        supabase,
      ),
      new OrderItemRepository(
        supabase,
      ),
      new ProductRepository(
        supabase,
      ),
      new ProductVariantRepository(
        supabase,
      ),
      new BrandRepository(
        supabase,
      ),
      new CategoryRepository(
        supabase,
      ),
    );

  return service.getOrders(
    user.id,
  );
}

export async function getOrder(
  orderNumber: string,
) {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "You must be signed in.",
    );
  }

  const service =
    new OrderQueryService(
      new OrderRepository(
        supabase,
      ),
      new OrderItemRepository(
        supabase,
      ),
      new ProductRepository(
        supabase,
      ),
      new ProductVariantRepository(
        supabase,
      ),
      new BrandRepository(
        supabase,
      ),
      new CategoryRepository(
        supabase,
      ),
    );

  const result =
    await service.getOrder(
      orderNumber,
    );

  if (!result) {
    return null;
  }

  if (
    result.order.userId !==
    user.id
  ) {
    throw new Error(
      "Unauthorized.",
    );
  }

  return result;
}

export async function updateEstimatedDelivery(
  orderId: string,
  estimatedDeliveryStart: string | null,
  estimatedDeliveryEnd: string | null,
) {
  const supabase =
    await createServerSupabaseClient();

  const service =
    new OrderCommandService(
      new OrderRepository(
        supabase,
      ),
      new OrderItemRepository(
        supabase,
      ),
      new ProductRepository(
        supabase,
      ),
      new ProductVariantRepository(
        supabase,
      ),
    );

  await service.updateEstimatedDelivery(
    orderId,
    estimatedDeliveryStart,
    estimatedDeliveryEnd,
  );

  return {
    success: true,
  };
}