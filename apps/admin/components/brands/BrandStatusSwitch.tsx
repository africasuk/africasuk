"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";

interface BrandStatusSwitchProps {
  id: string;
  checked: boolean;
}

type ApiResponse = {
  message?: string;
};

export default function BrandStatusSwitch({
  id,
  checked,
}: BrandStatusSwitchProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(checked);

  async function handleChange(value: boolean) {
    const previousValue = enabled;

    setEnabled(value);
    setLoading(true);

    try {
      const response = await fetch(`/api/brands/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: value,
        }),
      });

      if (!response.ok) {
        let message = "Failed to update brand status.";

        try {
          const result: ApiResponse = await response.json();
          if (typeof result.message === "string" && result.message.trim()) {
            message = result.message;
          }
        } catch {
          // Keep the fallback message if the response isn't valid JSON.
        }

        throw new Error(message);
      }

      toast.success("Brand status updated.");
      router.refresh();
    } catch (error) {
      setEnabled(previousValue);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update brand status."
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