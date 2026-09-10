import { View, Text, StyleSheet } from "react-native";
import { ShieldCheck } from "lucide-react-native";

const BRAND_COLOR = "#005c2e";

export default function CheckoutHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <ShieldCheck
            size={20}
            color={BRAND_COLOR}
            strokeWidth={2}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Secure Checkout</Text>
          <Text style={styles.subtitle}>
            End-to-end encrypted · 256-bit SSL protection
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.3,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    letterSpacing: -0.1,
  },
});