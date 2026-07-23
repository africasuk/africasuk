"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/shared/PageHeader";
import CategoryForm from "@/components/categories/CategoryForm";

export default function NewCategoryPage() {
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

        slug: "",

        imageUrl: null,
        parentId: null,
        level: 1,

        sortOrder: Number(
          form.get("sortOrder") ?? 0
        ),

        isActive:
          form.get("isActive") === "on",
      };

      const response = await fetch(
        "/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to create category."
        );
      }

      toast.success(
        "Category created successfully."
      );

      router.push("/manager/categories");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create category."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        title="New Category"
        description="Create a new marketplace category."
      />

      <CategoryForm
        mode="create"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}