"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

interface CategoryStatusSwitchProps {
  id: string;
  checked: boolean;
}

export default function CategoryStatusSwitch({
  id,
  checked,
}: CategoryStatusSwitchProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(checked);

  async function handleChange(value: boolean) {
    setEnabled(value);
    setLoading(true);

    try {
      const response = await fetch(
        `/api/categories/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: value,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Failed to update category status."
        );
      }

      toast.success("Category status updated.");

      router.refresh();
    } catch (error) {
      setEnabled(!value);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update category status."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Switch
      checked={enabled}
      disabled={loading}
      onCheckedChange={handleChange}
    />
  );
}