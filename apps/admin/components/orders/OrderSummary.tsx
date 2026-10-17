"use client";

import type { Order } from "@africasuk/types";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, PackageCheck } from "lucide-react";

interface Props {
  order: Order;
}

function formatMoney(amount: number, currency = "USD") {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${currency} ${safeAmount.toFixed(2)}`;
}

export function OrderSummary({ order }: Props) {
  const isPickup = order.fulfillmentMethod === "PICKUP";
  const shipping = Number(order.shipping ?? 0);
  const currency = order.currency || "USD";

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl font-bold tracking-tight sm:text-2xl">
          Order Summary
        </CardTitle>

        {/* Fulfillment method */}
        <div
          className={`mt-3 flex items-center gap-3 rounded-lg border p-3 ${
            isPickup
              ? "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30"
              : "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
          }`}
        >
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
            <p className="font-semibold">
              {isPickup ? "Office Pickup" : "Home Delivery"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPickup
                ? "Customer collects the order"
                : "Order delivered to the customer's address"}
            </p>
          </div>

          <Badge
            variant={isPickup ? "secondary" : "default"}
            className="shrink-0"
          >
            {isPickup ? "OFFICE PICKUP" : "HOME DELIVERY"}
          </Badge>
        </div>

        {/* Collection method or delivery fee */}
        <div className="mt-2 flex items-center justify-between gap-4 rounded-md bg-muted/50 p-3 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            {isPickup ? "Collection method" : "Delivery fee"}
          </span>

          <span className="text-right font-semibold">
            {isPickup
              ? "Office Pickup — FREE"
              : formatMoney(shipping, currency)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 text-sm sm:p-6 sm:text-base">
        {/* Order details */}
        <div className="flex flex-col justify-between gap-1 pb-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-muted-foreground">Order Number</span>
          <span className="break-all font-medium">
            {order.orderNumber}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-1 pb-2 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-muted-foreground">Created</span>
          <span>
            {format(
              new Date(order.createdAt),
              "dd MMM yyyy, hh:mm a",
            )}
          </span>
        </div>

        {/* Financial breakdown */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="break-all font-medium">
              {formatMoney(Number(order.subtotal), currency)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Shipping</span>
            <span className="break-all font-medium">
              {formatMoney(isPickup ? 0 : shipping, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Tax</span>
            <span className="break-all font-medium">
              {formatMoney(Number(order.tax), currency)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Discount</span>
            <span className="break-all font-medium text-emerald-600 dark:text-emerald-500">
              -{formatMoney(Number(order.discount), currency)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-t pt-4 text-base font-semibold sm:text-lg">
            <span>Total</span>
            <span className="break-all">
              {formatMoney(Number(order.total), currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}