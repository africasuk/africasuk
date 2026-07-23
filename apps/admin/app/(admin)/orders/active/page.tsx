import { redirect } from "next/navigation";

import { getOrders } from "@/app/actions/orders";

import { OrderTable } from "@/components/orders/OrderTable";
import PageHeader from "@/components/shared/PageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";



export default async function ActiveOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  const activeOrders = orders.filter((order) =>
    ["PENDING", "PROCESSING", "SHIPPED"].includes(order.status),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Orders"
        description="Manage pending, processing, and shipped orders."
      />

      <OrderTable orders={activeOrders} />
    </div>
  );
}