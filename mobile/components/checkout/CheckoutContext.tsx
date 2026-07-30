import { createContext, useContext, useMemo, useState } from "react";
import type { Address } from "@africasuk/types";

export type PaymentMethod = "COD" | "ONLINE";

type CheckoutContextValue = {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
};

const CheckoutContext = createContext<CheckoutContextValue | undefined>(
  undefined
);

export function CheckoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const value = useMemo(
    () => ({
      paymentMethod,
      setPaymentMethod,
      selectedAddress,
      setSelectedAddress,
    }),
    [paymentMethod, selectedAddress]
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
    throw new Error("useCheckout must be used inside CheckoutProvider.");
  }

  return context;
}