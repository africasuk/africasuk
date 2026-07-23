"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import CategoryForm from "@/components/categories/CategoryForm";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const response = await fetch("/api/categories", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!response.ok) {
      toast.error("Failed to create category");
      return;
    }

    toast.success("Category created");
    router.push("/categories");
    router.refresh();
  }

  return (
    <CategoryForm
      mode="create"
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}