"use client";

import Link from "next/link";
import { Edit } from "lucide-react";

import DeleteDialog from "@/components/shared/DeleteDialog";

import { Button } from "@/components/ui/button";

interface RowActionsProps {
  editHref: string;

  deleteTitle?: string;
  deleteDescription?: string;
  deleteUrl?: string;

  showEdit?: boolean;
  showDelete?: boolean;
}

export default function RowActions({
  editHref,
  deleteTitle,
  deleteDescription,
  deleteUrl,
  showEdit = true,
  showDelete = true,
}: RowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
     {showEdit && (
          <Link href={editHref}>
            <Button
              variant="outline"
              size="sm"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        )}
      {showDelete &&
        deleteTitle &&
        deleteDescription &&
        deleteUrl && (
          <DeleteDialog
            title={deleteTitle}
            description={deleteDescription}
            deleteUrl={deleteUrl}
          />
        )}
    </div>
  );
}