
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default async function CancelledOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cancelled Orders"
        description="View all cancelled orders."
      />

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/orders/print?status=CANCELLED">
            Export / Print Orders
          </Link>
        </Button>
      </div>

      <OrderTable orders={cancelledOrders} />
    </div>
  );
}
