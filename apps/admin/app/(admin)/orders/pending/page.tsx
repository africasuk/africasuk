import { redirect } from "next/navigation";

import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import PageHeader from "@/components/shared/PageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function PendingOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Orders"
        description="Manage orders awaiting confirmation."
      />

      <OrderTable orders={pendingOrders} />
    </div>
  );
}