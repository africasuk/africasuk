import Link from "next/link";
import { redirect } from "next/navigation";

import { getOrders } from "@/app/actions/orders";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";



export default async function OrdersPage() {
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

  const completedOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  );

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage and monitor all marketplace orders."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/orders/active">
          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg">
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>
                Pending, Processing & Shipped
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-4xl font-bold">
                {activeOrders.length}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/orders/completed">
          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg">
            <CardHeader>
              <CardTitle>Completed Orders</CardTitle>
              <CardDescription>
                Successfully delivered orders
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-4xl font-bold">
                {completedOrders.length}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/orders/cancelled">
          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg">
            <CardHeader>
              <CardTitle>Cancelled Orders</CardTitle>
              <CardDescription>
                Cancelled by customer or admin
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-4xl font-bold">
                {cancelledOrders.length}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/orders/history">
          <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-lg">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>
                View every marketplace order
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-4xl font-bold">
                {orders.length}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}