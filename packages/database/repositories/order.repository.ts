import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "@africasuk/types";

import type { SupabaseClient } from "@supabase/supabase-js";

type OrderRow = {
  id: string;

  user_id: string | null;

  order_number: string;

  status: OrderStatus;

  payment_status: PaymentStatus;
  payment_method: string;

  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;

  currency: string;

  customer_name: string;
  customer_email: string;
  customer_phone: string | null;

  country: string;
  state: string | null;
  city: string;
  address: string;
  postal_code: string | null;

  notes: string | null;

  estimated_delivery_start: string | null;
  estimated_delivery_end: string | null;
  estimated_delivery_updated_at: string | null;

  tracking_number: string | null;
  admin_notes: string | null;

  created_at: string;
  updated_at: string;
};

export interface CreateOrderInput {
  userId: string | null;

  orderNumber: string;

  status: OrderStatus;

  paymentStatus: PaymentStatus;
  paymentMethod: string;

  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;

  currency: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string | null;

  country: string;
  state: string | null;
  city: string;
  address: string;
  postalCode: string | null;

  notes: string | null;

  estimatedDeliveryStart: string | null;
  estimatedDeliveryEnd: string | null;
  estimatedDeliveryUpdatedAt: string | null;

  trackingNumber: string | null;
  adminNotes: string | null;
}

export class OrderRepository {
  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

  private mapOrder(
    row: OrderRow,
  ): Order {
    return {
      id: row.id,

      userId: row.user_id,

      orderNumber: row.order_number,

      status: row.status,

      paymentStatus:
        row.payment_status,

      paymentMethod:
        row.payment_method,

      subtotal: row.subtotal,
      shipping: row.shipping,
      tax: row.tax,
      discount: row.discount,
      total: row.total,

      currency: row.currency,

      customerName:
        row.customer_name,

      customerEmail:
        row.customer_email,

      customerPhone:
        row.customer_phone,

      country: row.country,
      state: row.state,
      city: row.city,
      address: row.address,
      postalCode:
        row.postal_code,

      notes: row.notes,

      estimatedDeliveryStart:
        row.estimated_delivery_start,

      estimatedDeliveryEnd:
        row.estimated_delivery_end,

      estimatedDeliveryUpdatedAt:
        row.estimated_delivery_updated_at,

      trackingNumber:
        row.tracking_number,

      adminNotes:
        row.admin_notes,

      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findAll(): Promise<Order[]> {
    const { data, error } =
      await this.supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) throw error;

    return (data ?? []).map((row) =>
      this.mapOrder(row as OrderRow),
    );
  }

  async findById(
    id: string,
  ): Promise<Order | null> {
    const { data, error } =
      await this.supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) throw error;

    return data
      ? this.mapOrder(
          data as OrderRow,
        )
      : null;
  }

async findByOrderNumber(
  orderNumber: string,
): Promise<Order | null> {
  console.log(
    "Searching order:",
    orderNumber,
  );

  const { data, error } =
    await this.supabase
      .from("orders")
      .select("*")
      .eq(
        "order_number",
        orderNumber,
      )
      .maybeSingle();

  console.log({
    data,
    error,
  });

  if (error) throw error;

  return data
    ? this.mapOrder(
        data as OrderRow,
      )
    : null;
}

  async findByUser(
    userId: string,
  ): Promise<Order[]> {
    const { data, error } =
      await this.supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", {
          ascending: false,
        });

    if (error) throw error;

    return (data ?? []).map((row) =>
      this.mapOrder(row as OrderRow),
    );
  }

  async create(
    input: CreateOrderInput,
  ): Promise<Order> {
    const { data, error } =
      await this.supabase
        .from("orders")
        .insert({
          user_id: input.userId,

          order_number:
            input.orderNumber,

          status: input.status,

          payment_status:
            input.paymentStatus,

          payment_method:
            input.paymentMethod,

          subtotal: input.subtotal,
          shipping: input.shipping,
          tax: input.tax,
          discount: input.discount,
          total: input.total,

          currency:
            input.currency,

          customer_name:
            input.customerName,

          customer_email:
            input.customerEmail,

          customer_phone:
            input.customerPhone,

          country:
            input.country,

          state: input.state,

          city: input.city,

          address:
            input.address,

          postal_code:
            input.postalCode,

          notes: input.notes,

          estimated_delivery_start:
            input.estimatedDeliveryStart,

          estimated_delivery_end:
            input.estimatedDeliveryEnd,

          estimated_delivery_updated_at:
            input.estimatedDeliveryUpdatedAt,

          tracking_number:
            input.trackingNumber,

          admin_notes:
            input.adminNotes,
        })
        .select()
        .single();

    if (error) throw error;

    return this.mapOrder(
      data as OrderRow,
    );
  }

  async update(
    id: string,
    input: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      estimatedDeliveryStart?: string | null;
      estimatedDeliveryEnd?: string | null;
      trackingNumber?: string | null;
      adminNotes?: string | null;
    },
  ): Promise<void> {
    const updateData: Record<
      string,
      unknown
    > = {};

    if (input.status !== undefined) {
      updateData.status =
        input.status;
    }

    if (
      input.paymentStatus !==
      undefined
    ) {
      updateData.payment_status =
        input.paymentStatus;
    }

    if (
      input.estimatedDeliveryStart !==
      undefined
    ) {
      updateData.estimated_delivery_start =
        input.estimatedDeliveryStart;
    }

    if (
      input.estimatedDeliveryEnd !==
      undefined
    ) {
      updateData.estimated_delivery_end =
        input.estimatedDeliveryEnd;
    }

    if (
      input.estimatedDeliveryStart !==
        undefined ||
      input.estimatedDeliveryEnd !==
        undefined
    ) {
      updateData.estimated_delivery_updated_at =
        new Date().toISOString();
    }

    if (
      input.trackingNumber !==
      undefined
    ) {
      updateData.tracking_number =
        input.trackingNumber;
    }

    if (
      input.adminNotes !==
      undefined
    ) {
      updateData.admin_notes =
        input.adminNotes;
    }

    const { error } =
      await this.supabase
        .from("orders")
        .update(updateData)
        .eq("id", id);

    if (error) {
      throw error;
    }
  }

  async delete(
    id: string,
  ): Promise<void> {
    const { error } =
      await this.supabase
        .from("orders")
        .delete()
        .eq("id", id);

    if (error) throw error;
  }
}