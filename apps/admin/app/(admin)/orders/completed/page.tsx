
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default async function CompletedOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  const completedOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Orders"
        description="View all successfully delivered orders."
      />

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/orders/print">
            Export / Print Orders
          </Link>
        </Button>
      </div>

      <OrderTable orders={completedOrders} />
    </div>
  );
}
