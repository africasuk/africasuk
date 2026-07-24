"use client";

import { useState } from "react";

import type { Order } from "@africasuk/types";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from "@/constants/orderStatus";

interface Props {
  order: Order;
}

export function OrderManagement({
  order,
}: Props) {
  const [editing, setEditing] = useState(false);

  const [status, setStatus] =
    useState(order.status);

  const [
    paymentStatus,
    setPaymentStatus,
  ] = useState(
    order.paymentStatus,
  );

  const [
    trackingNumber,
    setTrackingNumber,
  ] = useState(
    order.trackingNumber ?? "",
  );

  const [
    estimatedDeliveryStart,
    setEstimatedDeliveryStart,
  ] = useState(
    order.estimatedDeliveryStart ??
      "",
  );

  const [
    estimatedDeliveryEnd,
    setEstimatedDeliveryEnd,
  ] = useState(
    order.estimatedDeliveryEnd ??
      "",
  );

  const [
    adminNotes,
    setAdminNotes,
  ] = useState(
    order.adminNotes ?? "",
  );

  const [saving, setSaving] =
    useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      await updateOrder(order.id, {
        status,
        paymentStatus,
        trackingNumber:
          trackingNumber.trim() || null,
        estimatedDeliveryStart:
          estimatedDeliveryStart || null,
        estimatedDeliveryEnd:
          estimatedDeliveryEnd || null,
        adminNotes:
          adminNotes.trim() || null,
      });
      
      setEditing(false);
      alert("Order updated successfully.");
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update order.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
          Order Management
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {!editing ? (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Order Status</Label>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <span
                    className={`h-3 w-3 rounded-full ${ORDER_STATUS_COLORS[status]}`}
                  />

                  <span className="font-medium">
                    {ORDER_STATUS_LABELS[status]}
                  </span>
                </div>
              </div>

              <Info
                label="Payment Status"
                value={paymentStatus}
              />

              <Info
                label="Tracking Number"
                value={trackingNumber || "-"}
              />

              <Info
                label="Delivery Start"
                value={estimatedDeliveryStart || "-"}
              />

              <Info
                label="Delivery End"
                value={estimatedDeliveryEnd || "-"}
              />

              <div className="sm:col-span-2 space-y-2">
                <Label className="text-sm font-medium">
                  Admin Notes
                </Label>
                {/* Fixed line 160 parameters: updated break-words -> wrap-break-word & min-h-[4rem] -> min-h-16 */}
                <p className="rounded-md border p-3 text-sm whitespace-pre-wrap bg-muted/30 wrap-break-word min-h-16">
                  {adminNotes || "No admin notes."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                className="w-full sm:w-auto"
                onClick={() => setEditing(true)}
              >
                Update
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {/* Order Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Order Status
                </Label>
                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value as Order["status"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">
                      Pending
                    </SelectItem>

                    <SelectItem value="CONFIRMED">
                      Confirmed
                    </SelectItem>

                    <SelectItem value="PROCESSING">
                      Processing
                    </SelectItem>

                    <SelectItem value="READY_FOR_PICKUP">
                      Ready for Pickup
                    </SelectItem>

                    <SelectItem value="IN_TRANSIT">
                      In Transit
                    </SelectItem>

                    <SelectItem value="AT_BORDER">
                      At Border
                    </SelectItem>

                    <SelectItem value="AT_JUBA_WAREHOUSE">
                      At Juba Warehouse
                    </SelectItem>

                    <SelectItem value="OUT_FOR_DELIVERY">
                      Out for Delivery
                    </SelectItem>

                    <SelectItem value="DELIVERED">
                      Delivered
                    </SelectItem>

                    <SelectItem value="CANCELLED">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Payment Status
                </Label>
                <Select
                  value={paymentStatus}
                  onValueChange={(value) =>
                    setPaymentStatus(value as Order["paymentStatus"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="FAILED">Failed</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tracking Number */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Tracking Number
                </Label>
                <Input
                  className="w-full"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>

              {/* Delivery Start */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Delivery Start
                </Label>
                <Input
                  type="date"
                  className="w-full min-h-10"
                  value={estimatedDeliveryStart}
                  onChange={(e) => setEstimatedDeliveryStart(e.target.value)}
                />
              </div>

              {/* Delivery End */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Delivery End
                </Label>
                <Input
                  type="date"
                  className="w-full min-h-10"
                  value={estimatedDeliveryEnd}
                  onChange={(e) => setEstimatedDeliveryEnd(e.target.value)}
                />
              </div>

              {/* Admin Notes */}
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-sm font-medium">
                  Admin Notes
                </Label>
                <Textarea
                  rows={5}
                  className="w-full resize-y text-sm"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <p className="rounded-md border p-3 text-sm bg-card break-all font-medium text-foreground">
        {value}
      </p>
    </div>
  );
}