import { redirect } from "next/navigation";

import { getOrders } from "@/app/actions/orders";

import { OrderTable } from "@/components/orders/OrderTable";
import PageHeader from "@/components/shared/PageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";


export default async function OrderHistoryPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order History"
        description="View the complete history of all marketplace orders."
      />

      <OrderTable orders={orders} />
    </div>
  );
}