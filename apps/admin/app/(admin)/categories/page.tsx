import { CategoryRepository } from "@africasuk/database";
import { CategoryService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { Category } from "@africasuk/types";

import PageHeader from "@/components/shared/PageHeader";
import CategoryTable from "@/components/categories/CategoryTable";

async function getCategories(): Promise<Category[]> {
  const supabase = await createServerSupabaseClient();

  const repository = new CategoryRepository(supabase);
  const service = new CategoryService(repository);

  return await service.getAll();
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Categories"
        description="Manage all marketplace categories."
        actions={[
          {
            label: "New Category",
            href: "/categories/new",
          },
        ]}
      />

      <CategoryTable categories={categories} />
    </div>
  );
}