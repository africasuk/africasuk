import { createClient } from "@/lib/auth/client";

import type {
  Address,
  Profile,
} from "@africasuk/types";

interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface PlaceOrderParams {
  profile: Profile;
  selectedAddress: Address;
  items: CartItem[];
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export async function placeOrder({
  profile,
  selectedAddress,
  items,
  paymentMethod,
  subtotal,
  shipping,
  tax,
  total,
}: PlaceOrderParams) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please login again.");
  }

  const orderNumber = `AS-${Date.now()}`;

  const { data: order, error: orderError } = await (
    supabase.from("orders") as any
  )
    .insert({
      user_id: user.id,

      order_number: orderNumber,

      status: "PENDING",
      payment_status: "PENDING",

      payment_method: paymentMethod,

      subtotal,
      shipping,
      tax,
      discount: 0,
      total,

      currency: "USD",

      customer_name: profile.fullName,
      customer_email: profile.email,
      customer_phone: profile.phone,

      country: selectedAddress.country,
      state: selectedAddress.state,
      city: selectedAddress.city,
      address: selectedAddress.street,
      postal_code: selectedAddress.postalCode,

      notes: null,

      estimated_delivery_start: null,
      estimated_delivery_end: null,
      estimated_delivery_updated_at: null,

      tracking_number: null,
      admin_notes: null,
    })
    .select()
    .single();

  if (orderError) {
    throw orderError;
  }

  const { error: itemsError } = await (
    supabase.from("order_items") as any
  ).insert(
    items.map((item) => ({
      order_id: order.id,

      product_id: item.productId,
      variant_id: item.variantId,

      name: item.name,
      image: item.image,

      price: item.price,
      quantity: item.quantity,
    })),
  );

  if (itemsError) {
    // Roll back order if item insertion fails
    await (supabase.from("orders") as any)
      .delete()
      .eq("id", order.id);

    throw itemsError;
  }

  // Send order confirmation email
  try {
    const response = await fetch(
      "https://www.africasuk.com/api/email/order-confirmation",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          order: {
            id: order.id,
            orderNumber: order.order_number,
            status: order.status,
            paymentStatus: order.payment_status,
            paymentMethod: order.payment_method,
            subtotal: order.subtotal,
            shipping: order.shipping,
            tax: order.tax,
            discount: order.discount,
            total: order.total,
            currency: order.currency,
            createdAt: order.created_at,
          },

          customer: {
            name: profile.fullName,
            email: profile.email,
            phone: profile.phone,
          },

          items: items.map((item) => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      },
    );

    const responseText = await response.text();

    console.log(
      "Order confirmation API status:",
      response.status,
    );

    console.log(
      "Order confirmation API response:",
      responseText,
    );

    if (!response.ok) {
      console.error(
        "Order confirmation email failed:",
        responseText,
      );
    } else {
      console.log(
        "Order confirmation email sent:",
        order.order_number,
      );
    }
  } catch (emailError) {
    console.error(
      "Order confirmation email error:",
      emailError,
    );
  }

  return order;
}