import {
  differenceInCalendarDays,
  format,
} from "date-fns";

import type { Order } from "@africasuk/types";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

interface Props {
  order: Order;
}

export function OrderInfo({
  order,
}: Props) {
  const orderedDate = new Date(
    order.createdAt,
  );

  const daysSinceOrder =
    differenceInCalendarDays(
      new Date(),
      orderedDate,
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Customer & Order Information
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>

          <p className="text-sm">
            {order.customerName}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>

          <p className="text-sm">
            {order.customerEmail}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Ordered On</Label>

          <p className="text-sm">
            {format(
              orderedDate,
              "PPP 'at' p",
            )}
          </p>
        </div>

        <div className="space-y-2">
          <Label>
            Days Since Order
          </Label>

          <p className="text-sm">
            {daysSinceOrder}{" "}
            {daysSinceOrder === 1
              ? "day"
              : "days"}
          </p>
        </div>

        <div className="space-y-2">
          <Label>
            Payment Method
          </Label>

          <p className="text-sm">
            {order.paymentMethod ??
              "Not specified"}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Phone</Label>

          <p className="text-sm">
            {order.customerPhone ??
              "-"}
          </p>
        </div>

        <div className="space-y-2">
          <Label>Country</Label>

          <p className="text-sm">
            {order.country}
          </p>
        </div>

        <div className="space-y-2">
          <Label>State</Label>

          <p className="text-sm">
            {order.state ?? "-"}
          </p>
        </div>

        <div className="space-y-2">
          <Label>City</Label>

          <p className="text-sm">
            {order.city}
          </p>
        </div>

        <div className="space-y-2">
          <Label>
            Estimated Delivery From
          </Label>

          <p className="text-sm">
            {order.estimatedDeliveryStart
              ? format(
                  new Date(
                    order.estimatedDeliveryStart,
                  ),
                  "PPP",
                )
              : "-"}
          </p>
        </div>

        <div className="space-y-2">
          <Label>
            Estimated Delivery To
          </Label>

          <p className="text-sm">
            {order.estimatedDeliveryEnd
              ? format(
                  new Date(
                    order.estimatedDeliveryEnd,
                  ),
                  "PPP",
                )
              : "-"}
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Address</Label>

          <p className="text-sm">
            {order.address}
          </p>
        </div>

        <div className="space-y-2">
          <Label>
            Postal Code
          </Label>

          <p className="text-sm">
            {order.postalCode ??
              "-"}
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
            <Label>Customer Notes</Label>

            <p className="text-sm whitespace-pre-wrap">
              {order.notes ?? "No notes."}
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Admin Notes</Label>

            <p className="text-sm whitespace-pre-wrap">
              {order.adminNotes ?? "No admin notes."}
            </p>
          </div>
      </CardContent>
    </Card>
  );
}