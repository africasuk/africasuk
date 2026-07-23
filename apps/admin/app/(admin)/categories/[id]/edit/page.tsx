import { notFound } from "next/navigation";

import { CategoryRepository } from "@africasuk/database";
import { CategoryService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import PageHeader from "@/components/shared/PageHeader";
import EditCategoryForm from "@/components/categories/EditCategoryForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getCategory(id: string) {
  const supabase =
    await createServerSupabaseClient();

  const repository =
    new CategoryRepository(supabase);

  const service =
    new CategoryService(repository);

  try {
    return await service.getById(id);
  } catch {
    return null;
  }
}

export default async function EditCategoryPage({
  params,
}: PageProps) {
  const { id } = await params;

  const category =
    await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        title="Edit Category"
        description="Update category information."
      />

      <EditCategoryForm
        category={category}
      />
    </div>
  );
}