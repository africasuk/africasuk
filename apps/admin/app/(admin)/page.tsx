import Link from "next/link";
import { Plus, ArrowRight, TrendingUp, DollarSign, Clock } from "lucide-react";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
  OrderRepository,
} from "@africasuk/database";

import DashboardStats from "@/components/dashboard/DashboardStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = createAdminSupabaseClient();

  const brandRepository = new BrandRepository(supabase);
  const categoryRepository = new CategoryRepository(supabase);
  const productRepository = new ProductRepository(supabase);
  const orderRepository = new OrderRepository(supabase);

  const [brands, categories, products, orders] = await Promise.all([
    brandRepository.getAll(),
    categoryRepository.getAll(),
    productRepository.getAll(),
    orderRepository.findAll(),
  ]);

  // Financial & Operational calculations
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  const pendingOrders = orders.filter((o) =>
    ["PENDING", "PROCESSING"].includes(o.status)
  );
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatUSD = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const stats = {
    brands: brands.length,
    categories: categories.length,
    products: products.length,
    orders: orders.length,
  };

  return (
    <div className="space-y-8 p-1 sm:p-2">
      {/* 1. Header Banner & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Marketplace Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time analytics, order pipelines, and inventory performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/products/new">
            <Button size="sm" className="gap-1.5 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </Link>
          <Link href="/orders">
            <Button size="sm" variant="outline" className="gap-1.5 shadow-xs">
              <span>View Orders</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top-Level Core Metric Cards */}
      <DashboardStats stats={stats} />

      {/* 3. Secondary Metrics Bar (Revenue & Workflows) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 sm:p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <DollarSign className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Gross Volume
            </p>
            <p className="text-xl font-bold tracking-tight text-foreground font-mono">
              {formatUSD(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending Fulfillment
            </p>
            <p className="text-xl font-bold tracking-tight text-foreground font-mono">
              {pendingOrders.length} orders
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-5 flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Average Order Value
            </p>
            <p className="text-xl font-bold tracking-tight text-foreground font-mono">
              {orders.length > 0 ? formatUSD(totalRevenue / orders.length) : "$0"}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Lower Operational Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Orders Stream (4 Cols) */}
        <Card className="lg:col-span-4 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <CardDescription className="text-xs">
                Latest customer purchases awaiting action
              </CardDescription>
            </div>
            <Link
              href="/orders"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground">
                No orders recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-border/60">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0 gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground truncate">
                          {order.orderNumber}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                          {order.status.toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {order.customerName} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold font-mono">
                        {formatUSD(order.total)}
                      </p>
                      <Link
                        href={`/orders/${order.orderNumber}`}
                        className="text-xs text-primary hover:underline"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Inventory / Catalog Status (3 Cols) */}
        <Card className="lg:col-span-3 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Catalog Health</CardTitle>
            <CardDescription className="text-xs">
              System distribution across product lines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Catalog Density</span>
                <span className="font-medium text-foreground">
                  {categories.length > 0
                    ? `${(products.length / categories.length).toFixed(1)} items / cat`
                    : "0"}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (products.length / (categories.length * 10 || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg border p-3 bg-muted/20">
                <p className="text-xs text-muted-foreground">Active Brands</p>
                <p className="text-lg font-bold mt-0.5">{brands.length}</p>
                <Link
                  href="/brands"
                  className="text-[11px] text-primary hover:underline inline-block mt-1"
                >
                  Manage brands →
                </Link>
              </div>

              <div className="rounded-lg border p-3 bg-muted/20">
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-lg font-bold mt-0.5">{categories.length}</p>
                <Link
                  href="/categories"
                  className="text-[11px] text-primary hover:underline inline-block mt-1"
                >
                  Manage categories →
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}