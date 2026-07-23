import { BrandRepository } from "@africasuk/database";
import { BrandService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import DashboardStats from "@/components/dashboard/DashboardStats";
import PageHeader from "@/components/shared/PageHeader";

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const brandRepository = new BrandRepository(supabase);
  const brandService = new BrandService(brandRepository);

  const brands = await brandService.getAll();

  return {
    brands: brands.length,

    // Temporary until we build them
    categories: 0,
    products: 0,
    orders: 0,
  };
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back to AfricaSuk Admin."
      />

      <DashboardStats stats={stats} />
    </div>
  );
}
