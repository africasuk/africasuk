import { redirect } from "next/navigation";

import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import PageHeader from "@/components/shared/PageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function ProcessingOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  const processingOrders = orders.filter(
    (order) => order.status === "PROCESSING",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Processing Orders"
        description="Manage orders currently being prepared."
      />

      <OrderTable orders={processingOrders} />
    </div>
  );
}