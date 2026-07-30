import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { CreditCard } from "lucide-react-native";

import { PaymentService, type PaymentSetting } from "@/services/paymentService";
import { useCart } from "@/store/cart";

import CheckoutPaymentMethod from "./CheckoutPaymentMethod";

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const LIGHT_GREEN = "#ecfdf5";

export default function CheckoutPaymentWrapper() {
  const items = useCart((state) => state.items);

  const [products, setProducts] = useState<PaymentSetting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      if (!items.length) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } =
        await PaymentService.getPaymentSettings(
          items.map((item) => item.productId)
        );

      if (error) {
        console.error("Failed to load payment settings:", error);
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts(data);
      setLoading(false);
    }

    load();
  }, [items]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>03</Text>
          </View>

          <View style={styles.headerTitleGroup}>
            <Text style={styles.title}>Payment Method</Text>
            <Text style={styles.subtitle}>
              Select your preferred way to pay for this order.
            </Text>
          </View>
        </View>

        <View style={styles.iconCircle}>
          <CreditCard size={18} color={BRAND_LIGHT} />
        </View>
      </View>

      {/* Content State: Loading Skeleton vs Child Component */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={BRAND_LIGHT} />
          <Text style={styles.loadingText}>Fetching available payment options...</Text>
        </View>
      ) : (
        <CheckoutPaymentMethod products={products} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepBadge: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  stepText: {
    color: BRAND_DARK,
    fontWeight: "900",
    fontSize: 12,
  },
  headerTitleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_DARK,
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#6b7280",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT_GREEN,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  loadingContainer: {
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "600",
  },
});