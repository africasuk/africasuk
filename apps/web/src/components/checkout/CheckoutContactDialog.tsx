"use client";

import { useState } from "react";

import { Save } from "lucide-react";
import { toast } from "sonner";

import type { Profile } from "@africasuk/types";

import { createClient } from "@/lib/auth/client";

import { ProfileRepository } from "@africasuk/database";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CheckoutContactDialogProps {
  open: boolean;
  profile: Profile;
  onOpenChange(
    open: boolean,
  ): void;
  onSuccess?():
    | void
    | Promise<void>;
}

export default function CheckoutContactDialog({
  open,
  profile,
  onOpenChange,
  onSuccess,
}: CheckoutContactDialogProps) {
  const supabase =
    createClient();

  const [loading, setLoading] =
    useState(false);

  const [fullName, setFullName] =
    useState(
      profile.fullName ?? "",
    );

  const [phone, setPhone] =
    useState(
      profile.phone ?? "",
    );

  function resetForm() {
    setFullName(
      profile.fullName ?? "",
    );

    setPhone(
      profile.phone ?? "",
    );
  }

  async function save() {
    const name =
      fullName.trim();

    const phoneNumber =
      phone.trim();

    if (!name) {
      toast.error(
        "Please enter your full name.",
      );

      return;
    }

    if (!phoneNumber) {
      toast.error(
        "Please enter your phone number.",
      );

      return;
    }

    const phoneRegex =
      /^\+?[0-9]{6,15}$/;

    if (
      !phoneRegex.test(
        phoneNumber,
      )
    ) {
      toast.error(
        "Please enter a valid phone number.",
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Please sign in again.",
        );
      }

      await ProfileRepository.update(
        supabase,
        user.id,
        {
          fullName: name,
          phone: phoneNumber,
        },
      );

      toast.success(
        "Contact information updated.",
      );

      await Promise.resolve(
        onSuccess?.(),
      );

      onOpenChange(false);
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update contact information.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(
        value,
      ) => {
        if (value) {
          resetForm();
        }

        onOpenChange(value);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Complete Your Contact
            Information
          </DialogTitle>

          <DialogDescription>
            Before placing your
            order, please provide
            your full name and
            phone number. This
            information is used
            for delivery and order
            updates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <Input
              value={fullName}
              disabled={loading}
              placeholder="John Doe"
              onChange={(e) =>
                setFullName(
                  e.target.value,
                )
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <Input
              type="tel"
              value={phone}
              disabled={loading}
              placeholder="+211912345678"
              onChange={(e) =>
                setPhone(
                  e.target.value,
                )
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              disabled={loading}
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              disabled={loading}
              onClick={save}
            >
              <Save className="mr-2 h-4 w-4" />

              {loading
                ? "Saving..."
                : "Save & Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}