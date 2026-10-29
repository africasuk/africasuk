
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import PageHeader from "@/components/shared/PageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function FulfillmentOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  const fulfillmentStatuses = [
    "READY_FOR_PICKUP",
    "IN_TRANSIT",
    "AT_BORDER",
    "AT_JUBA_WAREHOUSE",
    "OUT_FOR_DELIVERY",
  ];

  const fulfillmentOrders = orders.filter((order) =>
    fulfillmentStatuses.includes(order.status),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fulfillment Orders"
        description="Manage orders currently moving through the fulfillment process."
      />

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/orders/print?status=FULFILLMENT">
            Export / Print Orders
          </Link>
        </Button>
      </div>

      <OrderTable orders={fulfillmentOrders} />
    </div>
  );
}
