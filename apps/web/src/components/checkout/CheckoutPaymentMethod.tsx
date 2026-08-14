"use client";

import { useEffect } from "react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { useCheckout } from "./CheckoutContext";

interface PaymentSetting {
  id: string;
  allowCod: boolean;
  allowOnlinePayment: boolean;
}

interface Props {
  products: PaymentSetting[];
}

export default function CheckoutPaymentMethod({
  products,
}: Props) {
  const {
    paymentMethod,
    setPaymentMethod,
  } = useCheckout();

  const productList = Array.isArray(products)
    ? products
    : [];

  // A payment method is available only if
  // ALL products support that method.
  const showCod =
    productList.length > 0 &&
    productList.every(
      (product) => product.allowCod
    );

  const showOnline =
    productList.length > 0 &&
    productList.every(
      (product) => product.allowOnlinePayment
    );

  // Automatically select the only available method.
  useEffect(() => {
    if (showCod && !showOnline) {
      setPaymentMethod("COD");
      return;
    }

    if (!showCod && showOnline) {
      setPaymentMethod("ONLINE");
      return;
    }

    // Both available or none available.
    // Let the customer choose.
  }, [
    showCod,
    showOnline,
    setPaymentMethod,
  ]);

  // No compatible payment method
  if (!showCod && !showOnline) {
    return (
      <Card className="rounded-2xl p-6">
        <h2 className="text-lg font-semibold">
          Payment Method
        </h2>

        <p className="mt-4 text-sm font-medium text-red-600">
          No payment method is available for these products.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Please remove a product or choose products
          with compatible payment options.
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl p-6">
      <h2 className="text-lg font-semibold">
        Payment Method
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Choose how you would like to pay.
      </p>

      <RadioGroup
        value={paymentMethod ?? ""}
        onValueChange={(value) => {
          setPaymentMethod(
            value as "COD" | "ONLINE"
          );
        }}
        className="mt-6 space-y-4"
      >
        {showCod && (
          <Label
            htmlFor="cod"
            className="flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition hover:bg-muted/50"
          >
            <RadioGroupItem
              id="cod"
              value="COD"
            />

            <div>
              <p className="font-medium">
                Cash on Delivery
              </p>

              <p className="text-sm text-muted-foreground">
                Pay when your order is delivered.
              </p>
            </div>
          </Label>
        )}

        {showOnline && (
          <Label
            htmlFor="online"
            className="flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition hover:bg-muted/50"
          >
            <RadioGroupItem
              id="online"
              value="ONLINE"
            />

            <div>
              <p className="font-medium">
                Online Payment
              </p>

              <p className="text-sm text-muted-foreground">
                Pay securely online.
              </p>
            </div>
          </Label>
        )}
      </RadioGroup>

      {showCod &&
        showOnline &&
        !paymentMethod && (
          <p className="mt-4 text-sm font-medium text-red-500">
            Please select a payment method before
            placing your order.
          </p>
        )}
    </Card>
  );
}