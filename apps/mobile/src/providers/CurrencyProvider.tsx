import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export type Currency = "USD" | "SSP";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
  initialCurrency?: Currency;
}

export function CurrencyProvider({
  children,
  initialCurrency = "USD",
}: Props) {
  const [currency, setCurrency] =
    useState<Currency>(initialCurrency);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
    }),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error(
      "useCurrency must be used inside CurrencyProvider."
    );
  }

  return context;
}