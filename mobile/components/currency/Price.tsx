import { Text, TextStyle } from "react-native";

import { useCurrencyPrice } from "@/hooks/useCurrencyPrice";

interface PriceProps {
  price: number;
  style?: TextStyle | TextStyle[];
}

export function Price({
  price,
  style,
}: PriceProps) {
  const { formatted } =
    useCurrencyPrice(price);

  return (
    <Text style={style}>
      {formatted}
    </Text>
  );
}