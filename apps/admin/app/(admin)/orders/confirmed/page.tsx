import { redirect } from "next/navigation";

import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import PageHeader from "@/components/shared/PageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ConfirmedOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  const confirmedOrders = orders.filter(
    (order) => order.status === "CONFIRMED",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Confirmed Orders"
        description="Manage orders confirmed and ready for processing."
      />

      <OrderTable orders={confirmedOrders} />
    </div>
  );
}