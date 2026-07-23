"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  id: string;
  open: boolean;
  onOpenChange(open: boolean): void;
}

export default function DeleteAddressDialog({
  id,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    // Wrap the entire async function in startTransition to fully utilize the pending state
    startTransition(async () => {
      try {
        const response = await fetch(`/api/addresses/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        toast.success("Address deleted.");
        onOpenChange(false);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to delete address."
        );
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl border border-neutral-100 max-w-[90vw] sm:max-w-md p-5 select-none antialiased bg-white">
        <AlertDialogHeader className="text-left">
          <AlertDialogTitle className="text-base font-bold text-neutral-900">
            Delete Address
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm text-neutral-500 font-medium leading-normal mt-1">
            Are you sure you want to delete this address? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-row items-center justify-end gap-2">
          <AlertDialogCancel 
            disabled={pending}
            className="h-9 rounded-lg border border-neutral-200 text-xs font-bold text-neutral-600 px-4 py-2 hover:bg-neutral-50 cursor-pointer disabled:opacity-40"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={pending}
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
            className="h-9 rounded-lg bg-rose-600 text-xs font-bold text-white px-4 py-2 hover:bg-rose-700 cursor-pointer shadow-xs disabled:opacity-40 flex items-center justify-center min-w-20"
          >
            {pending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin stroke-[2.5]" />
                <span>Deleting...</span>
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}