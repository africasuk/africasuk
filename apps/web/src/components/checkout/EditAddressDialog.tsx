"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ManualAddressForm from "./ManualAddressForm";
import { Address } from "@africasuk/database";


interface Props {
  open: boolean;

  address: Address | null;

  onOpenChange(
    open: boolean
  ): void;

  onSuccess(): void | Promise<void>;
}

export default function EditAddressDialog({
  open,
  address,
  onOpenChange,
  onSuccess,
}: Props) {
  if (!address) {
    return null;
  }

  async function handleSuccess() {
    await Promise.resolve(
      onSuccess()
    );

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Edit Address
          </DialogTitle>
        </DialogHeader>

        <ManualAddressForm
          mode="edit"
          address={address}
          onSuccess={
            handleSuccess
          }
          onCancel={() =>
            onOpenChange(false)
          }
        />
      </DialogContent>
    </Dialog>
  );
}