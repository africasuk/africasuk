import { redirect } from "next/navigation";

import { getOrders } from "@/app/actions/orders";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";
import OrderStatCard from "@/components/orders/OrderStatCard";

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  // 1. Pending
  const pendingOrders = orders.filter((order) => order.status === "PENDING");

  // 2. Confirmed
  const confirmedOrders = orders.filter(
    (order) => order.status === "CONFIRMED"
  );

  // 3. Processing
  const processingOrders = orders.filter(
    (order) => order.status === "PROCESSING"
  );

  // 4. In Fulfillment
  const fulfillmentStatuses = [
    "READY_FOR_PICKUP",
    "IN_TRANSIT",
    "AT_BORDER",
    "AT_JUBA_WAREHOUSE",
    "OUT_FOR_DELIVERY",
  ] as const;

  const fulfillmentOrders = orders.filter((order) =>
    fulfillmentStatuses.includes(
      order.status as (typeof fulfillmentStatuses)[number]
    )
  );

  // 5. Delivered
  const deliveredOrders = orders.filter((order) => order.status === "DELIVERED");

  // 6. Completed = Delivered + Paid
  const completedOrders = orders.filter(
    (order) => order.status === "DELIVERED" && order.paymentStatus === "PAID"
  );

  // 7. Cancelled
  const cancelledOrders = orders.filter((order) => order.status === "CANCELLED");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage and monitor all marketplace orders."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
        <OrderStatCard
          stage="pending"
          href="/orders/pending"
          title="Pending Orders"
          description="Awaiting initial confirmation"
          count={pendingOrders.length}
        />

        <OrderStatCard
          stage="confirmed"
          href="/orders/confirmed"
          title="Confirmed Orders"
          description="Confirmed for store processing"
          count={confirmedOrders.length}
        />

        <OrderStatCard
          stage="processing"
          href="/orders/processing"
          title="Processing Orders"
          description="Items currently being prepared"
          count={processingOrders.length}
        />

        <OrderStatCard
          stage="fulfillment"
          href="/orders/fulfillment"
          title="In Fulfillment"
          description="In transit, border, or delivery"
          count={fulfillmentOrders.length}
        />

        <OrderStatCard
          stage="delivered"
          href="/orders/delivered"
          title="Delivered Orders"
          description="Successfully dropped at destination"
          count={deliveredOrders.length}
        />

        <OrderStatCard
          stage="completed"
          href="/orders/completed"
          title="Completed Orders"
          description="Delivered and fully paid"
          count={completedOrders.length}
        />

        <OrderStatCard
          stage="cancelled"
          href="/orders/cancelled"
          title="Cancelled Orders"
          description="Cancelled by customer or store"
          count={cancelledOrders.length}
        />

        <OrderStatCard
          stage="history"
          href="/orders/history"
          title="Order History"
          description="All recorded marketplace orders"
          count={orders.length}
        />
      </div>
    </div>
  );
}