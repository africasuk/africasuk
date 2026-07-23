import { notFound } from "next/navigation";

import { BrandRepository } from "@africasuk/database";
import { BrandService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import PageHeader from "@/components/shared/PageHeader";
import EditBrandForm from "@/components/brands/EditBrandForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getBrand(id: string) {
  const supabase =
    await createServerSupabaseClient();

  const repository =
    new BrandRepository(supabase);

  const service =
    new BrandService(repository);

  try {
    return await service.getById(id);
  } catch {
    return null;
  }
}

export default async function EditBrandPage({
  params,
}: PageProps) {
  const { id } = await params;

  const brand = await getBrand(id);

  if (!brand) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        title="Edit Brand"
        description="Update brand information."
      />

      <EditBrandForm
        brand={brand}
        redirectPath="/manager/brands"
      />
    </div>
  );
}