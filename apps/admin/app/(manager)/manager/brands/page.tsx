import { BrandRepository } from "@africasuk/database";
import { BrandService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { Brand } from "@africasuk/types";

import BrandTable from "@/components/brands/BrandTable";

async function getBrands(): Promise<Brand[]> {
  const supabase =
    await createServerSupabaseClient();

  const repository =
    new BrandRepository(supabase);

  const service =
    new BrandService(repository);

  return await service.getAll();
}

export default async function BrandsPage() {
  const brands =
    await getBrands();

  return (
    <div className="space-y-8">

      <BrandTable
        brands={brands}
        basePath="/manager/brands"
        canDelete={false}
      />
    </div>
  );
}