"use client";

import { useRouter } from "next/navigation";

import DeleteDialog from "@/components/shared/DeleteDialog";

interface BrandActionsProps {
  id: string;
  name: string;
}

export default function BrandActions({
  id,
  name,
}: BrandActionsProps) {
  const router = useRouter();

  return (
    <DeleteDialog
      title="Delete Brand"
      description={`Are you sure you want to delete "${name}"? This action cannot be undone.`}
      deleteUrl={`/api/brands/${id}`}
      onSuccess={() => {
        router.refresh();
      }}
    />
  );
}