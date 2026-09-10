import { createContext, useContext, useMemo, useState, useCallback } from "react";
import type { Address } from "@africasuk/types";

export type PaymentMethod = "COD" | "ONLINE";

type CheckoutContextValue = {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  resetCheckout: () => void;
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
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderNotes, setOrderNotes] = useState<string>("");

  const resetCheckout = useCallback(() => {
    setPaymentMethod("COD");
    setSelectedAddress(null);
    setIsProcessing(false);
    setOrderNotes("");
  }, []);

  const value = useMemo(
    () => ({
      paymentMethod,
      setPaymentMethod,
      selectedAddress,
      setSelectedAddress,
      isProcessing,
      setIsProcessing,
      orderNotes,
      setOrderNotes,
      resetCheckout,
    }),
    [paymentMethod, selectedAddress, isProcessing, orderNotes, resetCheckout]
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