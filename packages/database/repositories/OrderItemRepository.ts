import type { SupabaseClient } from "@supabase/supabase-js";

import type { OrderItem } from "@africasuk/types";


type OrderItemRow = {
  id: string;

  order_id: string;

  product_id: string;
  variant_id: string;

  name: string;
  image: string | null;

  price: number;
  quantity: number;

  created_at: string;
};

export class OrderItemRepository {
  private mapOrderItem(
  row: OrderItemRow,
): OrderItem {
  return {
    id: row.id,

    orderId: row.order_id,

    productId: row.product_id,
    variantId: row.variant_id,

    name: row.name,
    image: row.image,

    price: Number(row.price),
    quantity: row.quantity,

    createdAt: row.created_at,
  };
}
  constructor(
    private readonly supabase: SupabaseClient,
  ) {}

  async findByOrder(
    orderId: string,
  ): Promise<OrderItem[]> {
    const { data, error } =
      await this.supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);

        if (error) throw error;

            return (data ?? []).map((row) =>
          this.mapOrderItem(
            row as OrderItemRow,
          )
        );
  }

  async createMany(
    items: Omit<
      OrderItem,
      "id" | "createdAt"
    >[],
  ): Promise<void> {
    const { error } =
      await this.supabase
        .from("order_items")
        .insert(
          items.map((item) => ({
            order_id: item.orderId,

            product_id: item.productId,
            variant_id: item.variantId,

            name: item.name,
            image: item.image,

            price: item.price,
            quantity: item.quantity,
          }))
        )

    if (error) throw error;
  }

  async deleteByOrder(
    orderId: string,
  ): Promise<void> {
    const { error } =
      await this.supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);

    if (error) throw error;
  }
}