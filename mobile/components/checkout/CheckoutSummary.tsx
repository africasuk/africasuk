import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, Href } from "expo-router";
import {
  CreditCard,
  Wallet,
  ArrowRight,
  AlertCircle,
} from "lucide-react-native";
import { placeOrder } from "@/lib/orders/placeOrder";
import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";
import { useCheckout } from "./CheckoutContext";
import type { Profile } from "@africasuk/types";
import AddAddressDialog from "./AddAddressDialog";
import CheckoutContactDialog from "./CheckoutContactDialog";

interface CheckoutSummaryProps {
  profile: Profile | null;
}

export default function CheckoutSummary({ profile }: CheckoutSummaryProps) {
  const [placingOrder, setPlacingOrder] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const { paymentMethod, selectedAddress } = useCheckout();

  const items = useCart((state) => state.items);
  const clear = useCart((state) => state.clear);

  const hasAddress = selectedAddress !== null;

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const shipping = 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

  async function handlePlaceOrder() {
    if (!selectedAddress) {
      Alert.alert(
        "Delivery Address",
        "Please add or select a delivery address."
      );
      return;
    }

    if (!profile || !profile.fullName?.trim()) {
      setContactDialogOpen(true);
      return;
    }

    const phone = profile.phone?.trim() ?? "";

    if (!phone) {
      setContactDialogOpen(true);
      return;
    }

    const phoneRegex = /^\+?[0-9]{6,15}$/;

    if (!phoneRegex.test(phone)) {
      setContactDialogOpen(true);
      return;
    }

    if (!selectedAddress.street?.trim()) {
      Alert.alert("Street Address", "Please enter your street address.");
      return;
    }

    if (!selectedAddress.city?.trim()) {
      Alert.alert("City", "Please enter your city.");
      return;
    }

    if (!selectedAddress.country?.trim()) {
      Alert.alert("Country", "Please enter your country.");
      return;
    }

    try {
      setPlacingOrder(true);

      const order = await placeOrder({
        profile,
        selectedAddress,
        items,
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
      });

      clear();

      if (paymentMethod === "COD") {
        Alert.alert("Success", "Order placed successfully.");
        router.replace(`/account/order/${order.id}` as Href);
      } else {
        Alert.alert("Success", "Order created.");
      }
    } catch (error) {
      console.error("Place Order Error:", error);
      Alert.alert(
        "Order Failed",
        error instanceof Error ? error.message : "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* 1. TOTAL PRICE HERO (Up Always) */}
      <View style={styles.priceHeroCard}>
        <View style={styles.priceHeroLeft}>
          <Text style={styles.priceHeroLabel}>Total Payable</Text>
          <Text style={styles.taxInclusiveText}>All taxes & fees included</Text>
        </View>
        <Price price={total} style={styles.priceHeroValue} />
      </View>

      {/* 2. COST BREAKDOWN */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <Text style={styles.headerCount}>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </Text>
        </View>

        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Subtotal</Text>
            <Price price={subtotal} style={styles.rowValue} />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Delivery</Text>
            <View style={styles.neutralPill}>
              <Text style={styles.neutralPillText}>FREE</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Estimated Tax</Text>
            <Price price={tax} style={styles.rowValue} />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Payment Method</Text>
            <View style={styles.paymentMethodTag}>
              {paymentMethod === "COD" ? (
                <>
                  <Wallet size={13} color="#27272a" strokeWidth={2} />
                  <Text style={styles.paymentMethodText}>Cash on Delivery</Text>
                </>
              ) : (
                <>
                  <CreditCard size={13} color="#27272a" strokeWidth={2} />
                  <Text style={styles.paymentMethodText}>Online Payment</Text>
                </>
              )}
            </View>
          </View>

          {/* Warning Banner if No Address */}
          {!hasAddress && (
            <View style={styles.warningBox}>
              <AlertCircle size={15} color="#b45309" strokeWidth={2} />
              <Text style={styles.warningText}>
                Select a delivery destination to place your order.
              </Text>
            </View>
          )}

          {/* Action Button */}
          {!hasAddress ? (
            <View style={styles.actionWrapper}>
              <AddAddressDialog />
            </View>
          ) : (
            <Pressable
              disabled={items.length === 0 || placingOrder}
              onPress={handlePlaceOrder}
              style={({ pressed }) => [
                styles.submitButton,
                (items.length === 0 || placingOrder) && styles.buttonDisabled,
                pressed && !placingOrder && styles.pressedState,
              ]}
            >
              {placingOrder ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.submitButtonText}>Processing Order...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.submitButtonText}>
                    {paymentMethod === "COD"
                      ? "Place Order"
                      : "Continue to Payment"}
                  </Text>
                  <ArrowRight size={15} color="#ffffff" strokeWidth={2} />
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>

      {/* Contact Profile Modal */}
      <CheckoutContactDialog
        open={contactDialogOpen}
        profile={profile}
        onOpenChange={setContactDialogOpen}
        onSuccess={() => {
          router.replace("/checkout" as Href);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },

  /* Price Up Always */
  priceHeroCard: {
    backgroundColor: "#f4f4f5",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  priceHeroLeft: {
    gap: 2,
  },

  priceHeroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#71717a",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  taxInclusiveText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#a1a1aa",
  },

  priceHeroValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#18181b",
    letterSpacing: -0.4,
  },

  /* Breakdown Card */
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
    paddingBottom: 10,
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#18181b",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  headerCount: {
    fontSize: 12,
    fontWeight: "500",
    color: "#71717a",
  },

  body: {
    gap: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowLabel: {
    fontSize: 13,
    color: "#71717a",
    fontWeight: "500",
  },

  rowValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
  },

  neutralPill: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  neutralPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#27272a",
    letterSpacing: 0.4,
  },

  paymentMethodTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },

  paymentMethodText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#18181b",
  },

  warningBox: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  warningText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#92400e",
    flex: 1,
  },

  actionWrapper: {
    marginTop: 4,
  },

  submitButton: {
    height: 46,
    backgroundColor: "#18181b",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  submitButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: -0.1,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  pressedState: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});