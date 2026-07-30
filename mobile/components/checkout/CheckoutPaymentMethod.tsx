import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useCheckout } from "./CheckoutContext";

interface PaymentSetting {
  id: string;
  allowCod: boolean;
  allowOnlinePayment: boolean;
}

interface Props {
  products: PaymentSetting[];
}

export default function CheckoutPaymentMethod({ products }: Props) {
  const { paymentMethod, setPaymentMethod } = useCheckout();

  const showCod = products.some((product) => product.allowCod);
  const showOnline = products.some((product) => product.allowOnlinePayment);

  useEffect(() => {
    if (showCod && !showOnline) {
      setPaymentMethod("COD");
    } else if (!showCod && showOnline) {
      setPaymentMethod("ONLINE");
    } else if (showCod && showOnline) {
      if (paymentMethod !== "COD" && paymentMethod !== "ONLINE") {
        setPaymentMethod("COD");
      }
    }
  }, [showCod, showOnline, paymentMethod, setPaymentMethod]);

  if (!showCod && !showOnline) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Payment Method</Text>
        <Text style={styles.errorText}>
          No payment method available for the products in your cart.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Payment Method</Text>
      <Text style={styles.subtitle}>Choose how you would like to pay.</Text>

      <View style={styles.optionsContainer}>
        {showCod && (
          <Pressable
            style={[
              styles.optionCard,
              paymentMethod === "COD" && styles.selectedOptionCard,
            ]}
            onPress={() => setPaymentMethod("COD")}
          >
            <View style={styles.radioOuter}>
              {paymentMethod === "COD" && <View style={styles.radioInner} />}
            </View>

            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Cash on Delivery</Text>
              <Text style={styles.optionDescription}>
                Pay when your order is delivered.
              </Text>
            </View>
          </Pressable>
        )}

        {showOnline && (
          <Pressable
            style={[
              styles.optionCard,
              paymentMethod === "ONLINE" && styles.selectedOptionCard,
            ]}
            onPress={() => setPaymentMethod("ONLINE")}
          >
            <View style={styles.radioOuter}>
              {paymentMethod === "ONLINE" && <View style={styles.radioInner} />}
            </View>

            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Online Payment</Text>
              <Text style={styles.optionDescription}>Pay securely online.</Text>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#ef4444",
  },
  optionsContainer: {
    marginTop: 20,
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    gap: 14,
  },
  selectedOptionCard: {
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#2563eb",
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  optionDescription: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
});