import { redirect } from "next/navigation";

import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import PageHeader from "@/components/shared/PageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function FulfillmentOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  const fulfillmentOrders = orders.filter((order) =>
    [
      "READY_FOR_PICKUP",
      "IN_TRANSIT",
      "AT_BORDER",
      "AT_JUBA_WAREHOUSE",
      "OUT_FOR_DELIVERY",
    ].includes(order.status),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fulfillment Orders"
        description="Manage orders currently moving through the fulfillment process."
      />

      <OrderTable orders={fulfillmentOrders} />
    </div>
  );
}