"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FulfillmentMethod, Order } from "@africasuk/types";
import { updateOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Truck, PackageCheck } from "lucide-react";

interface Props {
  order: Order;
}

export function OrderFulfillment({ order }: Props) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [method, setMethod] = useState<FulfillmentMethod>(
    order.fulfillmentMethod ?? "DELIVERY",
  );
  const [fee, setFee] = useState(String(order.shipping ?? 0));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const address = [
    order.address,
    order.city,
    order.state,
    order.postalCode,
    order.country,
  ]
    .filter(Boolean)
    .join(", ");

  const currency = order.currency || "USD";
  const isPickup = method === "PICKUP";

  async function handleSave() {
    const deliveryFee = isPickup ? 0 : Number(fee);

    if (
      !Number.isFinite(deliveryFee) ||
      deliveryFee < 0 ||
      (!isPickup && fee.trim() === "")
    ) {
      setMessage("Enter a valid delivery fee.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await updateOrder(order.id, {
        fulfillmentMethod: method,
        shipping: deliveryFee,
      });

      setFee(String(deliveryFee));
      setEditing(false);
      setMessage("Fulfillment updated.");

      // Refresh server-rendered order data for OrderSummary.
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to update fulfillment.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setMethod(order.fulfillmentMethod ?? "DELIVERY");
    setFee(String(order.shipping ?? 0));
    setMessage("");
    setEditing(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Delivery & Pickup</CardTitle>

        {!editing && (
          <Button
            variant="outline"
            onClick={() => {
              setMessage("");
              setEditing(true);
            }}
          >
            Update
          </Button>
        )}
      </CardHeader>

    <CardContent className="space-y-4">
  {!editing ? (
    <>
      {/* Saved fulfillment method */}
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
            isPickup
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
          }`}
        >
          {isPickup ? (
            <PackageCheck className="size-5" />
          ) : (
            <Truck className="size-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <Label>Fulfillment method</Label>
          <p className="mt-1 text-sm font-semibold">
            {isPickup
              ? "Meet at an Agreed Location — FREE"
              : "Home Delivery"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            isPickup
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
          }`}
        >
          {isPickup ? "AGREED LOCATION" : "HOME DELIVERY"}
        </span>
      </div>

      {/* Fee or collection method */}
      <div className="flex items-center justify-between gap-4 rounded-md bg-muted/50 p-3">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {isPickup ? "Meeting arrangement" : "Delivery fee"}
        </span>

        <span className="text-right text-sm font-semibold">
          {isPickup
            ? "Meet at an Agreed Location — FREE"
            : `${currency} ${Number(order.shipping ?? 0).toFixed(2)}`}
        </span>
      </div>
    </>
  ) : (
    <>
      <div className="space-y-2">
        <Label>Fulfillment method</Label>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant={isPickup ? "default" : "outline"}
            onClick={() => {
              setMethod("PICKUP");
              setFee("0");
            }}
          >
            <PackageCheck className="mr-2 size-4" />
            Meet at an Agreed Location — FREE
          </Button>

          <Button
            type="button"
            variant={!isPickup ? "default" : "outline"}
            onClick={() => {
              setMethod("DELIVERY");
              if (Number(fee) === 0) setFee("");
            }}
          >
            <Truck className="mr-2 size-4" />
            Home Delivery — PAID
          </Button>
        </div>
      </div>

      {!isPickup && (
        <div className="space-y-2">
          <Label>Delivery fee ({currency})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={fee}
            onChange={(event) => setFee(event.target.value)}
            placeholder="Enter delivery fee"
          />
          <p className="text-sm text-muted-foreground">
            Confirm the delivery fee based on the customer&apos;s delivery distance.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>

        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </>
  )}


        {/* Customer address */}
        <div>
          <Label>Customer address</Label>

          <p className="mt-1 wrap-break-word text-sm">
            {address || "No address provided"}
          </p>

          {address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-primary underline"
            >
              <MapPin className="size-4" />
              Open in Google Maps
            </a>
          )}
        </div>

        {message && (
          <p
            role="status"
            className={`text-sm ${
              message === "Fulfillment updated."
                ? "text-emerald-600"
                : "text-muted-foreground"
            }`}
          >
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}