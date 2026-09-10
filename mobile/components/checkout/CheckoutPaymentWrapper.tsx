import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { PaymentService, type PaymentSetting } from "@/services/paymentService";
import { useCart } from "@/store/cart";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";

export default function CheckoutPaymentWrapper() {
  const items = useCart((state) => state.items);

  const [products, setProducts] = useState<PaymentSetting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!items.length) {
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await PaymentService.getPaymentSettings(
          items.map((item) => item.productId)
        );

        if (!isMounted) return;

        if (error) {
          console.error("Failed to load payment settings:", error);
          setProducts([]);
        } else {
          setProducts(data ?? []);
        }
      } catch (err) {
        console.error("Unexpected error in PaymentService:", err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [items]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.helperText}>Checking availability...</Text>
        </View>

        <View style={styles.loadingSkeletonCard}>
          <ActivityIndicator size="small" color="#18181b" />
          <Text style={styles.loadingText}>Fetching available payment options...</Text>
        </View>
      </View>
    );
  }

  return <CheckoutPaymentMethod products={products} />;
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

  loadingSkeletonCard: {
    height: 96,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e4e4e7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 16,
  },

  loadingText: {
    fontSize: 12,
    color: "#71717a",
    fontWeight: "500",
  },
});