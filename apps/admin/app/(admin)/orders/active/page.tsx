
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import PageHeader from "@/components/shared/PageHeader";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

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

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/orders/print">
            Export / Print Orders
          </Link>
        </Button>
      </div>

      <OrderTable orders={activeOrders} />
    </div>
  );
}
