import type { Order } from "@africasuk/types";

import type { OrderItemDetails } from "@africasuk/api";

import { OrderInfo } from "./OrderInfo";
import { OrderItems } from "./OrderItems";
import { OrderManagement } from "./OrderManagement";
import { OrderSummary } from "./OrderSummary";

interface Props {
  order: Order;
  items: OrderItemDetails[];
}

export function OrderDetails({
  order,
  items,
}: Props) {
  return (
    <div className="space-y-6">
      <OrderSummary order={order} />
      <OrderManagement order={order} />

      <OrderInfo order={order} />
      <OrderItems
        order={order}
        items={items}
      />

    </div>
  );
}