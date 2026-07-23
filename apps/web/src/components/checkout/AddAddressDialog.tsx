"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MapPin,
  PencilLine,
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import ManualAddressForm from "./ManualAddressForm";

interface AddAddressDialogProps {
  onSuccess?: () => void | Promise<void>;
}

export default function AddAddressDialog({
  onSuccess,
}: AddAddressDialogProps) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [method, setMethod] =
    useState<
      "menu" | "manual"
    >("menu");

  async function handleSuccess() {
    try {
      setSaving(true);

      await Promise.resolve(
        onSuccess?.()
      );

      router.refresh();

      setOpen(false);
      setMethod("menu");
    } finally {
      setSaving(false);
    }
  }

  async function handleCurrentLocation() {
    try {
      setSaving(true);

      toast.loading(
        "Getting your location...",
        {
          id: "location",
        }
      );

      const position =
        await new Promise<GeolocationPosition>(
          (
            resolve,
            reject
          ) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
              }
            );
          }
        );

      toast.loading(
        "Finding your address...",
        {
          id: "location",
        }
      );

      const geoResponse =
        await fetch(
          "/api/geocode/reverse",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              latitude:
                position.coords
                  .latitude,
              longitude:
                position.coords
                  .longitude,
            }),
          }
        );

      const geo =
        await geoResponse.json();

      if (!geoResponse.ok) {
        throw new Error(
          geo.message ??
            "Unable to detect your address."
        );
      }

      toast.loading(
        "Saving address...",
        {
          id: "location",
        }
      );

      const saveResponse =
        await fetch(
          "/api/addresses",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              label:
                "Current Location",

              country:
                geo.country,

              state:
                geo.state,

              city: geo.city,

              area: geo.area,

              street:
                geo.street,

              building: "",

              apartment: "",

              landmark: "",

              postalCode:
                geo.postalCode,

              latitude:
                position.coords
                  .latitude,

              longitude:
                position.coords
                  .longitude,

              isDefault: true,
            }),
          }
        );

      const result =
        await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(
          result.message ??
            "Unable to save address."
        );
      }

      toast.success(
        "Address added successfully.",
        {
          id: "location",
        }
      );

      await Promise.resolve(
        onSuccess?.()
      );

      router.refresh();

      setOpen(false);
      setMethod("menu");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to add address.",
        {
          id: "location",
        }
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (saving) return;

        setOpen(value);

        if (!value) {
          setMethod("menu");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          Add Address
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-xl"
        onPointerDownOutside={(
          e
        ) => {
          if (saving) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(
          e
        ) => {
          if (saving) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            Add Delivery Address
          </DialogTitle>

          <DialogDescription>
            Choose how you&apos;d like to add your delivery address.
          </DialogDescription>
        </DialogHeader>

        {method ===
          "menu" && (
          <div className="grid gap-4 py-6">
            <Button
              type="button"
              variant="outline"
              className="h-20 justify-start"
              disabled={saving}
              onClick={
                handleCurrentLocation
              }
            >
              {saving ? (
                <Loader2 className="mr-4 h-6 w-6 animate-spin" />
              ) : (
                <MapPin className="mr-4 h-6 w-6" />
              )}

              <div className="text-left">
                <p className="font-semibold">
                  Use Current
                  Location
                </p>

                <p className="text-sm text-muted-foreground">
                  Detect your
                  location
                  automatically.
                </p>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-20 justify-start"
              disabled={saving}
              onClick={() =>
                setMethod(
                  "manual"
                )
              }
            >
              <PencilLine className="mr-4 h-6 w-6" />

              <div className="text-left">
                <p className="font-semibold">
                  Enter Manually
                </p>

                <p className="text-sm text-muted-foreground">
                  Type your
                  address
                  yourself.
                </p>
              </div>
            </Button>
          </div>
        )}

        {method ===
          "manual" && (
          <ManualAddressForm
            onSuccess={
              handleSuccess
            }
            onCancel={() =>
              setMethod("menu")
            }
          />
        )}
      </DialogContent>
    </Dialog>
  );
}