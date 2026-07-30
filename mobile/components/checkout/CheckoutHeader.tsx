import { View, Text, StyleSheet } from "react-native";
import { ShieldCheck } from "lucide-react-native";

export default function CheckoutHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <ShieldCheck
            size={24}
            color="#004d26"
            strokeWidth={2.5}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Secure Checkout
          </Text>

          <Text style={styles.subtitle}>
            Your data is protected. Complete your order securely.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(0,77,38,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,77,38,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});