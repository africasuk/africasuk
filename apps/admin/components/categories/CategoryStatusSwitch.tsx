"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

interface CategoryStatusSwitchProps {
  id: string;
  checked: boolean;
}

interface ApiResponse {
  message?: string;
}

export default function CategoryStatusSwitch({
  id,
  checked,
}: CategoryStatusSwitchProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(checked);

  async function handleChange(value: boolean) {
    const previousValue = enabled;

    setEnabled(value);
    setLoading(true);

    try {
      const response = await fetch(`/api/categories/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: value,
        }),
      });

      if (!response.ok) {
        let message = "Failed to update category status.";

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

      toast.success("Category status updated.");
      router.refresh();
    } catch (error) {
      setEnabled(previousValue);

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