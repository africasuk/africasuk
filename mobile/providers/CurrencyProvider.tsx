import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Currency =
  | "USD"
  | "SSP";

interface CurrencyContextValue {
  currency: Currency;

  setCurrency: (
    currency: Currency,
  ) => Promise<void>;
}

const CurrencyContext =
  createContext<
    CurrencyContextValue | undefined
  >(undefined);

interface CurrencyProviderProps {
  children: React.ReactNode;

  initialCurrency?: Currency;
}

const STORAGE_KEY =
  "@currency";

export function CurrencyProvider({
  children,
  initialCurrency = "USD",
}: CurrencyProviderProps) {
  const [currency, setCurrencyState] =
    useState<Currency>(
      initialCurrency,
    );

  useEffect(() => {
    loadCurrency();
  }, []);

  async function loadCurrency() {
    try {
      const saved =
        await AsyncStorage.getItem(
          STORAGE_KEY,
        );

      if (
        saved === "USD" ||
        saved === "SSP"
      ) {
        setCurrencyState(saved);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const setCurrency = async (
    value: Currency,
  ) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        value,
      );

      setCurrencyState(value);
    } catch (error) {
      console.error(error);
    }
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