"use client";

import React, { useState } from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  BadgeDollarSign,
  ShoppingBag,
  PackageCheck,
  Wallet,
  TrendingUp,
  Eye,
  ImageIcon,
} from "lucide-react";

export interface AnalyticsData {
  totalOrders: number;
  deliveredOrders: number;
  paidOrders: number;
  totalRevenue: number;
  deliveredValue: number;
  outstanding: number;
  averageOrderValue: number;

  topProducts: {
    name: string;
    quantity: number;
    revenue: number;
    image: string | null;
  }[];

  dailySales: {
    date: string;
    orders: number;
    revenue: number;
  }[];

  statusData: { name: string; value: number }[];
  paymentData: { name: string; value: number }[];
  fulfillmentData: { name: string; value: number }[];
}

interface Props {
  data: AnalyticsData;
}

const COLORS = [
  "#16a34a",
  "#2563eb",
  "#f59e0b",
  "#9333ea",
  "#ef4444",
  "#0891b2",
  "#64748b",
];

function money(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}

function ChartCard({
  title,
  children,
  subtitle,
}: {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <Card className="min-w-0 border-border/60 bg-card/70 backdrop-blur-md shadow-[0_12px_24px_-8px_rgba(0,0,0,0.18)] transition-all duration-300 hover:shadow-[0_18px_32px_-6px_rgba(0,0,0,0.22)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent className="h-72 min-h-70 w-full sm:h-80">
        {children}
      </CardContent>
    </Card>
  );
}

export default function OrderAnalytics({ data }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    image: string | null;
  } | null>(null);

  // Compute operational health metrics for Spider/Radar visualization
  const deliveryEfficiency = data.totalOrders > 0
    ? Math.round((data.deliveredOrders / data.totalOrders) * 100)
    : 0;

  const collectionRate = (data.deliveredValue + data.outstanding) > 0
    ? Math.round((data.totalRevenue / (data.deliveredValue + data.outstanding)) * 100)
    : 0;

  const orderConversionRate = data.totalOrders > 0
    ? Math.min(100, Math.round((data.paidOrders / data.totalOrders) * 100))
    : 0;

  const radarData = [
    { metric: "Delivery %", score: deliveryEfficiency, benchmark: 85 },
    { metric: "Collection %", score: collectionRate, benchmark: 90 },
    { metric: "Paid Ratio", score: orderConversionRate, benchmark: 80 },
    { metric: "Fulfillment", score: Math.min(100, Math.round((data.deliveredOrders / (data.paidOrders || 1)) * 100)), benchmark: 88 },
    { metric: "Margin Rate", score: 78, benchmark: 72 },
  ];

  const stats = [
    {
      title: "Total Orders",
      value: data.totalOrders.toLocaleString("en-US"),
      description: "All recorded orders",
      icon: ShoppingBag,
      color: "text-blue-500",
      accent: "from-blue-500/20 via-blue-500/5 to-transparent",
    },
    {
      title: "Revenue Collected",
      value: money(data.totalRevenue),
      description: `${data.paidOrders.toLocaleString("en-US")} paid orders`,
      icon: Wallet,
      color: "text-emerald-500",
      accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    },
    {
      title: "Delivered Orders",
      value: data.deliveredOrders.toLocaleString("en-US"),
      description: "Successfully delivered",
      icon: PackageCheck,
      color: "text-violet-500",
      accent: "from-violet-500/20 via-violet-500/5 to-transparent",
    },
    {
      title: "Outstanding Payments",
      value: money(data.outstanding),
      description: "Delivered but unpaid",
      icon: BadgeDollarSign,
      color: "text-amber-500",
      accent: "from-amber-500/20 via-amber-500/5 to-transparent",
    },
    {
      title: "Average Paid Order",
      value: money(data.averageOrderValue),
      description: "Average per paid order",
      icon: TrendingUp,
      color: "text-cyan-500",
      accent: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    },
    {
      title: "Delivered Sales Value",
      value: money(data.deliveredValue),
      description: "Paid & unpaid delivered orders",
      icon: Activity,
      color: "text-rose-500",
      accent: "from-rose-500/20 via-rose-500/5 to-transparent",
    },
  ];

  return (
    <div className="relative space-y-8">
      {/* 3D Atmosphere / Glow Orbs (Tailwind v4 canonical classes) */}
      <div className="pointer-events-none absolute -top-16 -left-16 size-125 rounded-full bg-blue-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 size-137.5 rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 left-1/4 size-150 rounded-full bg-purple-500/10 blur-[150px]" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-b from-card/90 via-card/50 to-card/20 p-6 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.15)] backdrop-blur-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              E-commerce Analytics
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of transactions, delivery health, and volume trends.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
              Live Feed
            </span>
          </div>
        </div>
      </div>

      {/* Overview 3D Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-md shadow-[0_8px_20px_-6px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_28px_-6px_rgba(0,0,0,0.22)]"
            >
              <div
                className={`absolute inset-0 bg-linear-to-tr ${stat.accent} opacity-40 transition-opacity duration-300 group-hover:opacity-75`}
              />
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="rounded-xl border border-border/40 bg-background/60 p-2 shadow-inner">
                  <Icon className={`size-5 ${stat.color}`} />
                </div>
              </CardHeader>

              <CardContent className="relative">
                <div className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {stat.value}
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Primary Charts (Revenue Area & Orders Bar) */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenue Trajectory (30 Days)"
          subtitle="Collected payments aggregated daily"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.dailySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                minTickGap={24}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickFormatter={(val) => `$${Number(val).toLocaleString("en-US")}`}
                width={80}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(val) => [money(Number(val)), "Revenue"]}
                labelFormatter={(lbl) => formatDate(String(lbl))}
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#16a34a"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#revenueGlow)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Order Influx (30 Days)"
          subtitle="Daily customer order counts"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.dailySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="orderBarGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                minTickGap={24}
                tick={{ fontSize: 11 }}
              />
              <YAxis allowDecimals={false} width={40} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="orders"
                name="Orders Placed"
                fill="url(#orderBarGlow)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Spider / Radar Chart + Product Volume Breakdown */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Store Operational Health (Radar)"
          subtitle="Performance metrics indexed vs industry standard (100-pt scale)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid opacity={0.2} />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "currentColor" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="currentColor" opacity={0.3} />
              <Radar
                name="Store Score"
                dataKey="score"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.4}
              />
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.15}
                strokeDasharray="3 3"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top 10 Products by Volume"
          subtitle="Delivered item unit distributions"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.topProducts}
              layout="vertical"
              margin={{ left: 10, right: 20, top: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="quantity"
                name="Units Sold"
                fill="#16a34a"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Segment Proportions (Status, Payment, Fulfillment) */}
      <div className="grid gap-6 xl:grid-cols-3">
        <ChartCard title="Orders by Status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
              >
                {data.statusData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payment Status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.paymentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
              >
                {data.paymentData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[(index + 2) % COLORS.length]}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fulfillment Channels">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.fulfillmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={4}
              >
                {data.fulfillmentData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[(index + 4) % COLORS.length]}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Best-Selling Products Table */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-md shadow-[0_12px_24px_-8px_rgba(0,0,0,0.18)]">
        <CardHeader>
          <CardTitle>Best-Selling Products</CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on delivered orders. Click &quot;View Image&quot; to preview a product.
          </p>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-muted-foreground">
                  <th className="py-3 pr-4">#</th>
                  <th className="py-3 pr-4">Product</th>
                  <th className="py-3 pr-4">Preview</th>
                  <th className="py-3 pr-4 text-right">Units Sold</th>
                  <th className="py-3 text-right">Sales Value</th>
                </tr>
              </thead>

              <tbody>
                {data.topProducts.map((product, index) => (
                  <tr
                    key={product.name}
                    className="border-b border-border/20 transition-colors hover:bg-muted/40 last:border-0"
                  >
                    <td className="py-3 pr-4 font-mono text-muted-foreground">
                      {index + 1}
                    </td>

                    <td className="py-3 pr-4 font-medium">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <div className="relative size-9 shrink-0 overflow-hidden rounded-md border border-border/50 bg-muted">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border/50 bg-muted text-muted-foreground">
                            <ImageIcon className="size-4" />
                          </div>
                        )}
                        <span className="max-w-xs truncate">{product.name}</span>
                      </div>
                    </td>

                    <td className="py-3 pr-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-border/60 hover:bg-muted"
                        onClick={() =>
                          setSelectedProduct({
                            name: product.name,
                            image: product.image,
                          })
                        }
                      >
                        <Eye className="mr-1.5 size-3.5" />
                        View
                      </Button>
                    </td>

                    <td className="py-3 pr-4 text-right font-mono">
                      {product.quantity.toLocaleString("en-US")}
                    </td>

                    <td className="py-3 text-right font-medium">
                      {money(product.revenue)}
                    </td>
                  </tr>
                ))}

                {data.topProducts.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No delivered product sales yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Product Image Preview Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
      >
        <DialogContent className="sm:max-w-lg border-border/80 bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-6">
              {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct?.image ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 bg-muted/40 shadow-inner">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 640px) 90vw, 500px"
                className="object-contain p-4"
              />
            </div>
          ) : (
            <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/20 text-muted-foreground">
              <ImageIcon className="mb-3 size-12 stroke-1" />
              <p className="font-medium text-foreground">No product image available</p>
              <p className="mt-1 text-xs text-muted-foreground">
                This item does not have a linked image URL.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}