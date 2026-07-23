"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import PageHeader from "@/components/shared/PageHeader";
import BrandForm from "@/components/brands/BrandForm";

export default function NewBrandPage() {
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
        website: form.get("website"),
        slug: "",
        logoUrl: null,
        isActive: true,
      };

      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to create brand."
        );
      }

      toast.success(
        "Brand created successfully."
      );

      router.push("/manager/brands");
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
        title="New Brand"
        description="Create a new product brand."
      />

      <BrandForm
        mode="create"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}