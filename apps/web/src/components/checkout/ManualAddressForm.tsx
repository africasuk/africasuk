"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  addressSchema,
  type AddressFormValues,
} from "@africasuk/validation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Address } from "@africasuk/database";

interface Props {
  mode?: "create" | "edit";

  address?: Address;

  onSuccess(): void | Promise<void>;

  onCancel(): void;
}

export default function ManualAddressForm({
  mode = "create",
  address,
  onSuccess,
  onCancel,
}: Props) {
  const [submitting, setSubmitting] =
    useState(false);

  const [locating, setLocating] =
    useState(false);

  const form =
    useForm<AddressFormValues>({
      resolver: zodResolver(
        addressSchema
      ),

defaultValues: {
  label:
    address?.label ?? "Home",

  country:
    address?.country ??
    "South Sudan",

  state:
    address?.state ??
    "Central Equatoria",

  city:
    address?.city ??
    "Juba",

  area:
    address?.area ?? "",

  street:
    address?.street ?? "",

  building:
    address?.building ?? "",

  apartment:
    address?.apartment ?? "",

  landmark:
    address?.landmark ?? "",

  postalCode:
    address?.postalCode ?? "",

  isDefault:
    address?.isDefault ??
    true,
},
    });

  async function handleCurrentLocation() {
    if (
      !navigator.geolocation
    ) {
      toast.error(
        "Geolocation is not supported."
      );

      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response =
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

          if (!response.ok) {
            throw new Error();
          }

          const address =
            await response.json();

          form.setValue(
            "country",
            address.country
          );

          form.setValue(
            "state",
            address.state
          );

          form.setValue(
            "city",
            address.city
          );

          form.setValue(
            "area",
            address.area
          );

          form.setValue(
            "street",
            address.street
          );

          form.setValue(
            "postalCode",
            address.postalCode ??
              ""
          );

          toast.success(
            "Location detected."
          );
        } catch {
          toast.error(
            "Unable to detect address."
          );
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error(
          "Location permission denied."
        );

        setLocating(false);
      }
    );
  }

async function onSubmit(
  values: AddressFormValues
) {
  try {
    setSubmitting(true);

    const response =
      await fetch(
        mode === "edit"
          ? `/api/addresses/${address!.id}`
          : "/api/addresses",
        {
          method:
            mode === "edit"
              ? "PATCH"
              : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            values
          ),
        }
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message ??
          `Unable to ${
            mode === "edit"
              ? "update"
              : "save"
          } address.`
      );
    }

    toast.success(
      mode === "edit"
        ? "Address updated successfully."
        : "Address saved successfully."
    );

    if (mode === "create") {
      form.reset({
        label: "Home",
        country:
          "South Sudan",
        state:
          "Central Equatoria",
        city: "Juba",
        area: "",
        street: "",
        building: "",
        apartment: "",
        landmark: "",
        postalCode: "",
        isDefault: true,
      });
    }

    await Promise.resolve(
      onSuccess()
    );
  } catch (error) {
    console.error(error);

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to save address."
    );
  } finally {
    setSubmitting(false);
  }
}

  return (
    <form
      onSubmit={form.handleSubmit(
        onSubmit
      )}
      className="space-y-4 pt-4"
    >
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={
          locating || submitting
        }
        onClick={
          handleCurrentLocation
        }
      >
        <MapPin className="mr-2 h-4 w-4" />

        {locating
          ? "Detecting location..."
          : "Use Current Location"}
      </Button>

      <Input
  placeholder="Address Label (Home, Office)"
  disabled={submitting}
  {...form.register("label")}
/>

<Input
  placeholder="Country"
  disabled={submitting}
  {...form.register("country")}
/>

<Input
  placeholder="State"
  disabled={submitting}
  {...form.register("state")}
/>

<Input
  placeholder="City"
  disabled={submitting}
  {...form.register("city")}
/>

<Input
  placeholder="Area / District"
  disabled={submitting}
  {...form.register("area")}
/>

<Input
  placeholder="Street Address"
  disabled={submitting}
  {...form.register("street")}
/>

<Input
  placeholder="Building (Optional)"
  disabled={submitting}
  {...form.register("building")}
/>

<Input
  placeholder="Apartment / Floor (Optional)"
  disabled={submitting}
  {...form.register("apartment")}
/>

<Input
  placeholder="Nearest Landmark (Optional)"
  disabled={submitting}
  {...form.register("landmark")}
/>

<Input
  placeholder="Postal Code (Optional)"
  disabled={submitting}
  {...form.register("postalCode")}
/>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? mode === "edit"
              ? "Updating..."
              : "Saving..."
            : mode === "edit"
              ? "Update Address"
              : "Save Address"}
        </Button>
      </div>
    </form>
  );
}