"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { Category } from "@africasuk/types";

import CategoryForm from "@/components/categories/CategoryForm";

interface EditCategoryFormProps {
  category: Category;
  redirectPath?: string;
}

export default function EditCategoryForm({
  category,
  redirectPath = "/categories",
}: EditCategoryFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);

      const payload = {
        name: form.get("name"),
        description: form.get("description"),

        slug: category.slug,
        imageUrl: category.imageUrl,

        sortOrder: Number(
          form.get("sortOrder") ?? 0
        ),

        isActive:
          form.get("isActive") === "on",
      };

      const response = await fetch(
        `/api/categories/${category.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to update category."
        );
      }

      toast.success(
        "Category updated successfully."
      );

      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update category."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <CategoryForm
      mode="edit"
      category={category}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}