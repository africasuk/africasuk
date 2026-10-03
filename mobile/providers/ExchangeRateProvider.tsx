import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState } from "react-native";

import { supabase } from "@/lib/supabase/client";

interface ExchangeRateContextValue {
  rate: number;
  loading: boolean;
  setRate: (rate: number) => void;
  refreshRate: () => Promise<void>;
}

const ExchangeRateContext =
  createContext<ExchangeRateContextValue | undefined>(
    undefined,
  );

interface ExchangeRateProviderProps {
  children: React.ReactNode;
}

export function ExchangeRateProvider({
  children,
}: ExchangeRateProviderProps) {
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshRate = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("exchange_rates")
        .select("rate")
        .eq("base_currency", "USD")
        .eq("target_currency", "SSP")
        .order("effective_date", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      const currentRate = Number(data?.rate);

      if (
        !Number.isFinite(currentRate) ||
        currentRate <= 0
      ) {
        throw new Error(
          "No valid USD/SSP exchange rate found.",
        );
      }

      setRate(currentRate);
    } catch (error) {
      console.error(
        "Failed to load exchange rate:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRate();

    const subscription = AppState.addEventListener(
      "change",
      (state) => {
        if (state === "active") {
          refreshRate();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const value = useMemo(
    () => ({
      rate,
      loading,
      setRate,
      refreshRate,
    }),
    [rate, loading],
  );

  return (
    <ExchangeRateContext.Provider value={value}>
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