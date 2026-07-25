import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface ExchangeRateContextValue {
  rate: number;
  setRate: (rate: number) => void;
}

const ExchangeRateContext = createContext<
  ExchangeRateContextValue | undefined
>(undefined);

interface Props {
  children: React.ReactNode;
  initialRate?: number;
}

export function ExchangeRateProvider({
  children,
  initialRate = 1,
}: Props) {
  const [rate, setRate] = useState(initialRate);

  const value = useMemo(
    () => ({
      rate,
      setRate,
    }),
    [rate]
  );

  return (
    <ExchangeRateContext.Provider value={value}>
      {children}
    </ExchangeRateContext.Provider>
  );
}

export function useExchangeRate() {
  const context = useContext(ExchangeRateContext);

  if (!context) {
    throw new Error(
      "useExchangeRate must be used inside ExchangeRateProvider."
    );
  }

  return context;
}