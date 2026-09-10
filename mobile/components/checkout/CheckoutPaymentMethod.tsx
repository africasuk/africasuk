import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Banknote, CreditCard, AlertCircle } from "lucide-react-native";
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

  // Strict cart evaluation: all items must permit COD for COD to be valid
  const showCod =
    products.length > 0 && products.every((product) => product.allowCod);
  const showOnline =
    products.length > 0 &&
    products.every((product) => product.allowOnlinePayment);

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
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.errorBanner}>
          <AlertCircle size={16} color="#dc2626" strokeWidth={2} />
          <Text style={styles.errorText}>
            No shared payment method available for the selected products.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text style={styles.helperText}>Select payment preference</Text>
      </View>

      {/* Options List */}
      <View style={styles.optionsList}>
        {/* Cash on Delivery */}
        {showCod && (
          <Pressable
            style={({ pressed }) => [
              styles.optionCard,
              paymentMethod === "COD" && styles.selectedOptionCard,
              pressed && styles.pressedState,
            ]}
            onPress={() => setPaymentMethod("COD")}
          >
            {/* Payment Icon */}
            <View
              style={[
                styles.iconContainer,
                paymentMethod === "COD" && styles.selectedIconContainer,
              ]}
            >
              <Banknote
                size={18}
                color={paymentMethod === "COD" ? "#18181b" : "#71717a"}
                strokeWidth={1.8}
              />
            </View>

            {/* Description */}
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Cash on Delivery</Text>
              <Text style={styles.optionDescription}>
                Pay in cash or mobile money upon receiving your order
              </Text>
            </View>

            {/* Custom Radio Button */}
            <View
              style={[
                styles.radioOuter,
                paymentMethod === "COD" && styles.radioOuterSelected,
              ]}
            >
              {paymentMethod === "COD" && <View style={styles.radioInner} />}
            </View>
          </Pressable>
        )}

        {/* Online Payment */}
        {showOnline && (
          <Pressable
            style={({ pressed }) => [
              styles.optionCard,
              paymentMethod === "ONLINE" && styles.selectedOptionCard,
              pressed && styles.pressedState,
            ]}
            onPress={() => setPaymentMethod("ONLINE")}
          >
            {/* Payment Icon */}
            <View
              style={[
                styles.iconContainer,
                paymentMethod === "ONLINE" && styles.selectedIconContainer,
              ]}
            >
              <CreditCard
                size={18}
                color={paymentMethod === "ONLINE" ? "#18181b" : "#71717a"}
                strokeWidth={1.8}
              />
            </View>

            {/* Description */}
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Card & Mobile Banking</Text>
              <Text style={styles.optionDescription}>
                Instant confirmation via 256-bit encrypted gateway
              </Text>
            </View>

            {/* Custom Radio Button */}
            <View
              style={[
                styles.radioOuter,
                paymentMethod === "ONLINE" && styles.radioOuterSelected,
              ]}
            >
              {paymentMethod === "ONLINE" && <View style={styles.radioInner} />}
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  helperText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  optionsList: {
    gap: 8,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    gap: 12,
  },

  selectedOptionCard: {
    borderColor: "#18181b",
    backgroundColor: "#fafafa",
  },

  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  selectedIconContainer: {
    backgroundColor: "#ffffff",
    borderColor: "#d4d4d8",
  },

  optionContent: {
    flex: 1,
    gap: 2,
  },

  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.2,
  },

  optionDescription: {
    fontSize: 12,
    color: "#71717a",
    lineHeight: 16,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#d4d4d8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  radioOuterSelected: {
    borderColor: "#18181b",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#18181b",
  },

  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },

  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#dc2626",
    lineHeight: 16,
  },

  pressedState: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});