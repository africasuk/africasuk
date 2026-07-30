import type { SupabaseClient } from "@supabase/supabase-js";

import type { Order } from "@africasuk/types";

type OrderRow = {
  id: string;

  image: string | null;

  user_id: string | null;

  order_number: string;

  status: Order["status"];
  payment_status: Order["paymentStatus"];

  payment_method: string | null;

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
      paymentStatus: row.payment_status,

      paymentMethod: row.payment_method,

      subtotal: Number(row.subtotal),
      shipping: Number(row.shipping),
      tax: Number(row.tax),
      discount: Number(row.discount),
      total: Number(row.total),

      currency: row.currency,

      customerName: row.customer_name,
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone,

      country: row.country,
      state: row.state,
      city: row.city,
      address: row.address,
      postalCode: row.postal_code,

      notes: row.notes,

      estimatedDeliveryStart: row.estimated_delivery_start,
      estimatedDeliveryEnd: row.estimated_delivery_end,
      estimatedDeliveryUpdatedAt:
        row.estimated_delivery_updated_at,

      trackingNumber: row.tracking_number,
      adminNotes: row.admin_notes,

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

    if (error) {
      throw error;
    }

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

    if (error) {
      throw error;
    }

    return data
      ? this.mapOrder(
          data as OrderRow,
        )
      : null;
  }

  async findByOrderNumber(
    orderNumber: string,
  ): Promise<Order | null> {
    const { data, error } =
      await this.supabase
        .from("orders")
        .select("*")
        .eq(
          "order_number",
          orderNumber,
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data
      ? this.mapOrder(
          data as OrderRow,
        )
      : null;
  }

  async findByUser(userId: string): Promise<(Order & { image?: string | null })[]> {
    const { data, error } = await this.supabase
      .from("orders")
      .select(`
        *,
        order_items (
          image
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((row: any) => ({
      ...this.mapOrder(row as OrderRow),
      image: row.order_items?.[0]?.image ?? null,
    }));
  }

  async create(
    order: Omit<
      Order,
      "id" | "createdAt" | "updatedAt"
    >,
  ): Promise<Order> {
    const { data, error } =
      await this.supabase
        .from("orders")
        .insert({

          user_id: order.userId,
          order_number: order.orderNumber,

          status: order.status,
          payment_status: order.paymentStatus,
          payment_method: order.paymentMethod,

          subtotal: order.subtotal,
          shipping: order.shipping,
          tax: order.tax,
          discount: order.discount,
          total: order.total,

          currency: order.currency,

          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_phone: order.customerPhone,

          country: order.country,
          state: order.state,
          city: order.city,
          address: order.address,
          postal_code: order.postalCode,

          notes: order.notes,

          estimated_delivery_start: order.estimatedDeliveryStart,
          estimated_delivery_end: order.estimatedDeliveryEnd,
          estimated_delivery_updated_at: order.estimatedDeliveryUpdatedAt,

          tracking_number: order.trackingNumber,
          admin_notes: order.adminNotes,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return this.mapOrder(
      data as OrderRow,
    );
  }

  async update(
    id: string,
    input: {
      status?: Order["status"];
      paymentStatus?: Order["paymentStatus"];
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

    updateData.updated_at =
      new Date().toISOString();

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

    if (error) {
      throw error;
    }
  }
}