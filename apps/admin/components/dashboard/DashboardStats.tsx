import StatCard from "./StatCard";

interface DashboardStatsProps {
  stats: {
    brands: number;
    categories: number;
    products: number;
    orders: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 lg:gap-6">
      <StatCard
        title="Brands"
        value={stats.brands}
        description="Active marketplace brands"
        iconName="brands"
        colorScheme="blue"
        href="/brands"
        trend={{ value: "+4.2%", isPositive: true }}
      />

      <StatCard
        title="Categories"
        value={stats.categories}
        description="Organized catalog groups"
        iconName="categories"
        colorScheme="violet"
        href="/categories"
      />

      <StatCard
        title="Products"
        value={stats.products}
        description="Live items listed"
        iconName="products"
        colorScheme="emerald"
        href="/products"
        trend={{ value: "+12.8%", isPositive: true }}
      />

      <StatCard
        title="Orders"
        value={stats.orders}
        description="Completed & pending sales"
        iconName="orders"
        colorScheme="amber"
        href="/orders"
        trend={{ value: "+8.1%", isPositive: true }}
      />
    </div>
  );
}