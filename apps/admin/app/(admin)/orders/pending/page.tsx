
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import PageHeader from "@/components/shared/PageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

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

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/orders/print?status=PENDING">
            Export / Print Orders
          </Link>
        </Button>
      </div>

      <OrderTable orders={pendingOrders} />
    </div>
  );
}
