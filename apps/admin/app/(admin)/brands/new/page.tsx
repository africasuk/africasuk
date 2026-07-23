"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import BrandForm from "@/components/brands/BrandForm";
import PageHeader from "@/components/shared/PageHeader";

export default function NewBrandPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  setLoading(true);

  try {
    const form = new FormData(
      e.currentTarget
    );

    const response = await fetch(
      "/api/brands",
      {
        method: "POST",
        body: form,
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ??
          "Failed to create brand."
      );
    }

    toast.success(
      "Brand created successfully."
    );

    router.push("/brands");
    router.refresh();
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to create brand."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        title="Create Brand"
        description="Add a new manufacturer or brand to your marketplace."
      />

      <BrandForm
        mode="create"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}