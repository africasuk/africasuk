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

interface ApiResponse {
  message?: string;
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
        name: String(form.get("name") ?? "").trim(),
        description: String(form.get("description") ?? ""),
        slug: category.slug,
        imageUrl: category.imageUrl,
        sortOrder: Number(form.get("sortOrder") ?? 0),
        isActive: form.get("isActive") === "on",
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

      if (!response.ok) {
        let message = "Failed to update category.";

        try {
          const result: ApiResponse = await response.json();

          if (
            typeof result.message === "string" &&
            result.message.trim()
          ) {
            message = result.message;
          }
        } catch {
          // Keep the fallback error message.
        }

        throw new Error(message);
      }

      toast.success("Category updated successfully.");
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