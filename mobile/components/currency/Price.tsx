
import { Text, StyleSheet, type TextStyle } from "react-native";
import { useCurrencyPrice } from "@/hooks/useCurrencyPrice";

interface PriceProps {
  price: number;
  style?: TextStyle | TextStyle[];
}

export function Price({ price, style }: PriceProps) {
  const { formatted } = useCurrencyPrice(price);

  return (
    <Text
      style={[style, styles.price]}
      numberOfLines={1}
      ellipsizeMode="clip"
      adjustsFontSizeToFit
      minimumFontScale={0.65}
      allowFontScaling={false}
    >
      {formatted}
    </Text>
  );
}

const styles = StyleSheet.create({
  price: {
    flexShrink: 1,
    minWidth: 0,
    includeFontPadding: false,
  },
});
