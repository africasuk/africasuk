"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutForm() {
  return (
    <Card className="space-y-6 rounded-2xl p-6">
      <div>
        <h2 className="text-xl font-semibold">
          Shipping Information
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter your delivery details.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>First Name</Label>

          <Input />
        </div>

        <div className="space-y-2">
          <Label>Last Name</Label>

          <Input />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Email</Label>

          <Input
            type="email"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Phone</Label>

          <Input />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label>Address</Label>

          <Input />
        </div>

        <div className="space-y-2">
          <Label>City</Label>

          <Input />
        </div>

        <div className="space-y-2">
          <Label>Country</Label>

          <Input />
        </div>
      </div>
    </Card>
  );
}