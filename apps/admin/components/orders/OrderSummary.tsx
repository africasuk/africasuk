"use client";

import type { Order } from "@africasuk/types";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  order: Order;
}

function formatMoney(
  currency: string,
  amount: number,
) {
  return `${currency} ${amount.toFixed(2)}`;
}

export function OrderSummary({
  order,
}: Props) {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
          Order Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4 text-sm sm:text-base">
        {/* Order Meta Rows */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 pb-2">
          <span className="text-muted-foreground">
            Order Number
          </span>
          <span className="font-medium wrap-break-word">
            {order.orderNumber}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 pb-2">
          <span className="text-muted-foreground">
            Created
          </span>
          <span className="text-foreground font-normal">
            {format(
              new Date(order.createdAt),
              "dd MMM yyyy, hh:mm a",
            )}
          </span>
        </div>

        {/* Financial Breakdown Panel */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground sm:text-foreground">
              Subtotal
            </span>
            <span className="font-medium break-all">
              {formatMoney(
                order.currency,
                order.subtotal,
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground sm:text-foreground">
              Shipping
            </span>
            <span className="font-medium break-all">
              {formatMoney(
                order.currency,
                order.shipping,
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground sm:text-foreground">
              Tax
            </span>
            <span className="font-medium break-all">
              {formatMoney(
                order.currency,
                order.tax,
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground sm:text-foreground">
              Discount
            </span>
            <span className="font-medium text-emerald-600 dark:text-emerald-500 break-all">
              -{formatMoney(
                order.currency,
                order.discount,
              )}
            </span>
          </div>

          {/* Grand Total */}
          <div className="border-t pt-4 flex items-center justify-between gap-4 text-base sm:text-lg font-semibold text-foreground">
            <span>Total</span>
            <span className="break-all">
              {formatMoney(
                order.currency,
                order.total,
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}