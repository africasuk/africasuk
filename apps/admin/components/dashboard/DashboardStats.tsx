import {
  Boxes,
  Building2,
  Package,
  ShoppingCart,
} from "lucide-react";

import StatCard from "./StatCard";

interface DashboardStatsProps {
  stats: {
    brands: number;
    categories: number;
    products: number;
    orders: number;
  };
}

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Brands"
        value={stats.brands}
        description="Total brands"
        icon={<Building2 className="h-5 w-5" />}
      />

      <StatCard
        title="Categories"
        value={stats.categories}
        description="Total categories"
        icon={<Boxes className="h-5 w-5" />}
      />

      <StatCard
        title="Products"
        value={stats.products}
        description="Total products"
        icon={<Package className="h-5 w-5" />}
      />

      <StatCard
        title="Orders"
        value={stats.orders}
        description="Total orders"
        icon={<ShoppingCart className="h-5 w-5" />}
      />
    </div>
  );
}