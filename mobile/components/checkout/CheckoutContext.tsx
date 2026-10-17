import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { Address } from "@africasuk/types";

export type PaymentMethod = "COD" | "ONLINE";
export type FulfillmentMethod = "PICKUP" | "DELIVERY";

type CheckoutContextValue = {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;

  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;

  fulfillmentMethod: FulfillmentMethod | null;
  setFulfillmentMethod: (method: FulfillmentMethod | null) => void;

  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;

  orderNotes: string;
  setOrderNotes: (notes: string) => void;

  resetCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextValue | undefined>(
  undefined,
);

export function CheckoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);

  // No fulfillment method is selected by default.
  const [fulfillmentMethod, setFulfillmentMethod] =
    useState<FulfillmentMethod | null>(null);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [orderNotes, setOrderNotes] = useState<string>("");

  const resetCheckout = useCallback(() => {
    setPaymentMethod("COD");
    setSelectedAddress(null);
    setFulfillmentMethod(null);
    setIsProcessing(false);
    setOrderNotes("");
  }, []);

  const value = useMemo(
    () => ({
      paymentMethod,
      setPaymentMethod,
      selectedAddress,
      setSelectedAddress,
      fulfillmentMethod,
      setFulfillmentMethod,
      isProcessing,
      setIsProcessing,
      orderNotes,
      setOrderNotes,
      resetCheckout,
    }),
    [
      paymentMethod,
      selectedAddress,
      fulfillmentMethod,
      isProcessing,
      orderNotes,
      resetCheckout,
    ],
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