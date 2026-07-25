import { Currency } from "@/providers/CurrencyProvider";

export function convertPrice(
  priceUsd: number,
  currency: Currency,
  exchangeRate: number
): number {
  if (currency === "SSP") {
    return Number((priceUsd * exchangeRate).toFixed(2));
  }

  return Number(priceUsd.toFixed(2));
}

export function formatPrice(
  amount: number,
  currency: Currency
): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  return `SSP ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

export function getDisplayPrice(
  priceUsd: number,
  currency: Currency,
  exchangeRate: number
): string {
  return formatPrice(
    convertPrice(priceUsd, currency, exchangeRate),
    currency
  );
}