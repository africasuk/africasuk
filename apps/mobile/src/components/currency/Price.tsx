import { Text } from "react-native";
import { useCurrencyPrice } from "@/hooks/useCurrencyPrice";

interface Props {
  price: number;
  style?: any;
}

export function Price({ price, style }: Props) {
  const { formatted } = useCurrencyPrice(price);

  return <Text style={style}>{formatted}</Text>;
}