"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Brand } from "@africasuk/types";

import BrandForm from "@/components/brands/BrandForm";

interface EditBrandFormProps {
  brand: Brand;
  redirectPath?: string;
}

export default function EditBrandForm({
  brand,
  redirectPath = "/brands",
}: EditBrandFormProps) {
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
      };

      const response = await fetch(
        `/api/brands/${brand.id}`,
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
            "Failed to update brand."
        );
      }

      toast.success(
        "Brand updated successfully."
      );

      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update brand."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <BrandForm
      mode="edit"
      brand={brand}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}