"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export type Currency =
  | "USD"
  | "SSP";

interface CurrencyContextValue {
  currency: Currency;

  setCurrency: (
    currency: Currency,
  ) => void;
}

const CurrencyContext =
  createContext<
    CurrencyContextValue | undefined
  >(undefined);

interface CurrencyProviderProps {
  children: React.ReactNode;

  initialCurrency: Currency;
}

export function CurrencyProvider({
  children,
  initialCurrency,
}: CurrencyProviderProps) {
  const [currency, setCurrencyState] =
    useState<Currency>(
      initialCurrency,
    );

  const setCurrency = (
    value: Currency,
  ) => {
    document.cookie = `currency=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;

    setCurrencyState(value);
  };

  const value =
    useMemo(
      () => ({
        currency,
        setCurrency,
      }),
      [currency],
    );

  return (
    <CurrencyContext.Provider
      value={value}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context =
    useContext(
      CurrencyContext,
    );

  if (!context) {
    throw new Error(
      "useCurrency must be used inside CurrencyProvider.",
    );
  }

  return context;
}