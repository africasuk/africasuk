import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ExchangeRateContextValue {
  rate: number;
  loading: boolean;
  setRate: (rate: number) => void;
}

const ExchangeRateContext =
  createContext<ExchangeRateContextValue | undefined>(
    undefined,
  );

interface ExchangeRateProviderProps {
  children: React.ReactNode;
  initialRate?: number;
}

export function ExchangeRateProvider({
  children,
  initialRate = 1800, // Default SSP rate until loaded from API
}: ExchangeRateProviderProps) {
  const [rate, setRate] =
    useState(initialRate);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    // TODO:
    // Replace this with a fetch from your backend/Supabase.
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      rate,
      loading,
      setRate,
    }),
    [rate, loading],
  );

  return (
    <ExchangeRateContext.Provider
      value={value}
    >
      {children}
    </ExchangeRateContext.Provider>
  );
}

export function useExchangeRate() {
  const context = useContext(
    ExchangeRateContext,
  );

  if (!context) {
    throw new Error(
      "useExchangeRate must be used inside ExchangeRateProvider.",
    );
  }

  return context;
}