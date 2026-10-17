"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type { Address } from "@africasuk/database";
import type { FulfillmentMethod } from "@africasuk/types";

export type PaymentMethod = "COD" | "ONLINE";

type CheckoutContextValue = {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;

  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;

  fulfillmentMethod: FulfillmentMethod | null;
  setFulfillmentMethod: (method: FulfillmentMethod | null) => void;
};

const CheckoutContext = createContext<
  CheckoutContextValue | undefined
>(undefined);

export function CheckoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);

  // No default selection: the customer must choose.
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod | null>(null);

  const value = useMemo(
    () => ({
      paymentMethod,
      setPaymentMethod,
      selectedAddress,
      setSelectedAddress,
      fulfillmentMethod,
      setFulfillmentMethod,
    }),
    [paymentMethod, selectedAddress, fulfillmentMethod],
  );

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error(
      "useCheckout must be used inside CheckoutProvider.",
    );
  }

  return context;
}