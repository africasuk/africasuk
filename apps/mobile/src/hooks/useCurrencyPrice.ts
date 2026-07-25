import { useMemo } from "react";

import {
  convertPrice,
  formatPrice,
} from "@/lib/currency";

import { useCurrency } from "@/providers/CurrencyProvider";
import { useExchangeRate } from "@/providers/ExchangeRateProvider";

export function useCurrencyPrice(priceUsd: number) {
  const { currency } = useCurrency();
  const { rate } = useExchangeRate();

  return useMemo(() => {
    const amount = convertPrice(priceUsd, currency, rate);

    return {
      currency,
      rate,
      amount,
      formatted: formatPrice(amount, currency),
    };
  }, [priceUsd, currency, rate]);
}