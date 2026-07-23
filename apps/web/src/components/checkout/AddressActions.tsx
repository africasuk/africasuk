"use client";

import {
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import {
  MoreVertical,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteAddressDialog from "./DeleteAddressDialog";

interface Props {
  id: string;
  isDefault: boolean;
  onEdit(): void;
}

export default function AddressActions({
  id,
  isDefault,
  onEdit,
}: Props) {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  async function handleDefault() {
    try {
      const response =
        await fetch(
          `/api/addresses/${id}/default`,
          {
            method: "PATCH",
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message
        );
      }

      toast.success(
        "Default address updated."
      );

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
        >
          <Button
            size="icon"
            variant="ghost"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={onEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          {!isDefault && (
            <DropdownMenuItem
              disabled={pending}
              onClick={
                handleDefault
              }
            >
              <Star className="mr-2 h-4 w-4" />
              Set Default
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="text-destructive"
            disabled={pending}
            onSelect={(
              event
            ) => {
              event.preventDefault();
              setDeleteOpen(
                true
              );
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAddressDialog
        id={id}
        open={deleteOpen}
        onOpenChange={
          setDeleteOpen
        }
      />
    </>
  );
}