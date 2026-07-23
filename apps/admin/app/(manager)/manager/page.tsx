import {
  DollarSign,
  Package,
  ShoppingCart,
  TriangleAlert,
} from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/dashboard/StatCard";

export default function ManagerDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back to the Manager Portal."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Products"
          value={0}
          icon={
            <Package className="h-5 w-5" />
          }
          description="Total products"
        />

        <StatCard
          title="Orders Today"
          value={0}
          icon={
            <ShoppingCart className="h-5 w-5" />
          }
          description="Today's orders"
        />

        <StatCard
          title="Sales Today"
          value="SSP 0"
          icon={
            <DollarSign className="h-5 w-5" />
          }
          description="Today's revenue"
        />

        <StatCard
          title="Low Stock"
          value={0}
          icon={
            <TriangleAlert className="h-5 w-5" />
          }
          description="Needs attention"
        />
      </div>
    </div>
  );
}