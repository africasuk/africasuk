"use client";

import { useCurrencyPrice } from "hooks/useCurrencyPrice";


interface PriceProps {
  price: number;

  className?: string;
}

export function Price({
  price,
  className,
}: PriceProps) {
  const {
    formatted,
  } = useCurrencyPrice(price);

  return (
    <span className={className}>
      {formatted}
    </span>
  );
}