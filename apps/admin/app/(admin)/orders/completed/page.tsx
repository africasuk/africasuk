
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrders } from "@/app/actions/orders";
import { OrderTable } from "@/components/orders/OrderTable";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wallet,
  ShoppingBag,
  Clock,
  TrendingUp,
  Receipt,
} from "lucide-react";

function formatMoney(amount: number) {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function CompletedOrdersPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  // All successfully delivered orders
  const completedOrders = orders.filter(
    (order) => order.status === "DELIVERED",
  );

  // Only payments actually received
  const paidOrders = completedOrders.filter(
    (order) => order.paymentStatus === "PAID",
  );

  // Delivered but not yet paid
  const unpaidOrders = completedOrders.filter(
    (order) => order.paymentStatus !== "PAID",
  );

  // Financial calculations
  const totalSales = completedOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );

  const moneyCollected = paidOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );

  const outstandingPayments = unpaidOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );

  const averageOrderValue =
    paidOrders.length > 0
      ? moneyCollected / paidOrders.length
      : 0;

  const stats = [
    {
      title: "Money Collected",
      value: formatMoney(moneyCollected),
      description: `${paidOrders.length} paid orders`,
      icon: Wallet,
      color: "text-emerald-600",
    },
    {
      title: "Total Sales Value",
      value: formatMoney(totalSales),
      description: "All delivered orders",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Outstanding Payments",
      value: formatMoney(outstandingPayments),
      description: `${unpaidOrders.length} unpaid orders`,
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "Total Delivered Orders",
      value: completedOrders.length.toLocaleString("en-US"),
      description: `${paidOrders.length} paid orders`,
      icon: ShoppingBag,
      color: "text-violet-600",
    },
    {
      title: "Average Paid Order",
      value: formatMoney(averageOrderValue),
      description: "Average revenue per paid order",
      icon: Receipt,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Completed Orders"
        description="Track delivered orders, collected revenue, and outstanding payments."
      />

      {/* Financial overview */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`size-5 ${stat.color}`} />
              </CardHeader>

              <CardContent>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/orders/print?status=DELIVERED">
            Export / Print Orders
          </Link>
        </Button>
      </div>

      {/* Delivered orders */}
      <OrderTable orders={completedOrders} />
    </div>
  );
}
