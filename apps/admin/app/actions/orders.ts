
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

const ORDER_STATUS_MESSAGES: Record<OrderStatus, string> = {
  PENDING: "Your order has been received and is awaiting confirmation.",
  CONFIRMED: "Great news! Your order has been confirmed.",
  PROCESSING: "Your order is now being prepared.",
  READY_FOR_PICKUP: "Your order is ready for pickup.",
  IN_TRANSIT: "Your order is on its way.",
  AT_BORDER: "Your order has reached the border.",
  AT_JUBA_WAREHOUSE: "Your order has arrived at our Juba warehouse.",
  OUT_FOR_DELIVERY: "Your order is out for delivery.",
  DELIVERED: "Your order has been delivered. Enjoy your purchase!",
  CANCELLED: "Your order has been cancelled.",
};

async function sendOrderStatusNotification({
  userId,
  orderId,
  orderNumber,
  status,
}: {
  userId: string;
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
}) {
  const supabase = createAdminSupabaseClient();

  const title = "Order Update";
  const body = ORDER_STATUS_MESSAGES[status];

  const notificationData = {
    orderId,
    orderNumber,
    status,
    screen: "orders",
  };

  // Save notification in the customer's notification inbox.
  const { error: notificationError } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title,
      body,
      type: "ORDER_STATUS",
      data: notificationData,
    });

  if (notificationError) {
    console.error("Failed to save order notification:", notificationError);
    return;
  }

  // Retrieve all devices registered by this customer.
  const { data: devices, error: devicesError } = await supabase
    .from("push_tokens")
    .select("expo_push_token")
    .eq("user_id", userId);

  if (devicesError) {
    console.error("Failed to retrieve push tokens:", devicesError);
    return;
  }

  if (!devices?.length) {
    console.log("No registered devices for customer:", userId);
    return;
  }

  const messages = devices.map((device) => ({
    to: device.expo_push_token,
    sound: "default",
    channelId: "default",
    priority: "high",
    title,
    body,
    data: {
      ...notificationData,
      notificationType: "ORDER_STATUS",
    },
  }));

  // Expo accepts up to 100 messages per request.
  for (let i = 0; i < messages.length; i += 100) {
    const batch = messages.slice(i, i + 100);

    try {
      const response = await fetch(
        "https://exp.host/--/api/v2/push/send",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batch),
        },
      );

      if (!response.ok) {
        console.error(
          "Expo push delivery failed:",
          await response.text(),
        );
        continue;
      }

      const result: {
      data?: Array<{
        status: string;
        id?: string;
        message?: string;
      }>;
    } = await response.json();

    console.log("Order notification delivery:", result.data);
    } catch (error) {
      console.error("Push notification error:", error);
    }
  }
}

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

  // Get the existing order before updating it.
  const { data: previousOrder, error: previousOrderError } =
    await supabase
      .from("orders")
      .select("id, user_id, order_number, status")
      .eq("id", id)
      .single();

  if (previousOrderError || !previousOrder) {
    throw new Error("Could not find the order.");
  }

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

    updates.total =
      Math.round(
        (subtotal + shipping + tax - discount) * 100,
      ) / 100;
  }

  // Update the order using your existing service.
  await service.updateOrder(id, updates);

  // Notify only when the order status actually changes.
  if (
    input.status &&
    previousOrder.status !== input.status &&
    previousOrder.user_id
  ) {
    try {
      await sendOrderStatusNotification({
        userId: previousOrder.user_id,
        orderId: previousOrder.id,
        orderNumber: previousOrder.order_number,
        status: input.status,
      });
    } catch (error) {
      // Notification failures must not undo a successful order update.
      console.error("Order notification failed:", error);
    }
  }

  revalidatePath("/orders");
  revalidatePath("/orders/[orderNumber]", "page");
}
