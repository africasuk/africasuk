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

  const showCod = products.some(
    (product) => product.allowCod
  );

  const showOnline = products.some(
    (product) =>
      product.allowOnlinePayment
  );

  useEffect(() => {
    if (showCod && !showOnline) {
      setPaymentMethod("COD");
    } else if (
      !showCod &&
      showOnline
    ) {
      setPaymentMethod("ONLINE");
    } else if (
      showCod &&
      showOnline
    ) {
      // Keep current selection.
      if (
        paymentMethod !== "COD" &&
        paymentMethod !== "ONLINE"
      ) {
        setPaymentMethod("COD");
      }
    }
  }, [
    showCod,
    showOnline,
    paymentMethod,
    setPaymentMethod,
  ]);

  if (
    !showCod &&
    !showOnline
  ) {
    return (
      <Card className="rounded-2xl p-6">
        <h2 className="text-lg font-semibold">
          Payment Method
        </h2>

        <p className="mt-4 text-sm text-red-500">
          No payment method available for the products in your cart.
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
        value={paymentMethod}
        onValueChange={(value) =>
          setPaymentMethod(
            value as
              | "COD"
              | "ONLINE"
          )
        }
        className="mt-6 space-y-4"
      >
        {showCod && (
          <Label
            htmlFor="cod"
            className="flex cursor-pointer items-start gap-4 rounded-xl border p-4"
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
            className="flex cursor-pointer items-start gap-4 rounded-xl border p-4"
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
    </Card>
  );
}