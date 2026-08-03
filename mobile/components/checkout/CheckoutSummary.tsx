import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ViewStyle,
  TextStyle,
} from "react-native";
import { router, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { CreditCard, Wallet, ShieldCheck, AlertCircle } from "lucide-react-native";
import { placeOrder } from "@/lib/orders/placeOrder";
import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";
import { useCheckout } from "./CheckoutContext";
import type { Profile } from "@africasuk/types";
import AddAddressDialog from "./AddAddressDialog";
import CheckoutContactDialog from "./CheckoutContactDialog";

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const LIGHT_GREEN = "#ecfdf5";

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

  router.replace(
    `/account/order/${order.id}` as Href
  );
} else {
  // TODO: Online payment
  Alert.alert("Success", "Order created.");
}
} catch (error) {
  console.error("Place Order Error:", error);

  Alert.alert(
    "Order Failed",
    error instanceof Error
      ? error.message
      : "Failed to place order."
  );
} finally {
  setPlacingOrder(false);
}
  }

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>04</Text>
          </View>
          <Text style={styles.headerTitle}>Order Summary</Text>
        </View>

        <Text style={styles.headerCount}>
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </Text>
      </View>

      {/* Breakdown Items */}
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subtotal</Text>
          <Price price={subtotal} />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Shipping</Text>
          <View style={styles.freeBadgeWrapper}>
            <Text style={styles.freeBadge}>FREE</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Estimated Tax</Text>
          <Price price={tax} />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Payment Method</Text>
          <View style={styles.methodBadge}>
            {paymentMethod === "COD" ? (
              <>
                <Wallet size={14} color={BRAND_LIGHT} />
                <Text style={styles.methodText}>Cash on Delivery</Text>
              </>
            ) : (
              <>
                <CreditCard size={14} color={BRAND_LIGHT} />
                <Text style={styles.methodText}>Online Payment</Text>
              </>
            )}
          </View>
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.taxSubtext}>Includes applicable taxes</Text>
          </View>
          <View style={styles.totalValueWrapper}>
            <Price price={total} />
          </View>
        </View>

        {/* Warning Banner if No Address */}
        {!hasAddress && (
          <View style={styles.warningBox}>
            <AlertCircle size={16} color="#92400e" style={{ marginTop: 1 }} />
            <Text style={styles.warningText}>
              Please add or select a delivery address before continuing.
            </Text>
          </View>
        )}

        {/* Action Button / Dialog */}
        {!hasAddress ? (
          <View style={styles.actionWrapper}>
            <AddAddressDialog />
          </View>
        ) : (
          <Pressable
            disabled={items.length === 0 || placingOrder}
            onPress={handlePlaceOrder}
            style={({ pressed }) => [
              styles.submitButtonWrapper,
              (items.length === 0 || placingOrder) && styles.buttonDisabled,
              pressed && !placingOrder && styles.pressedState,
            ]}
          >
            <LinearGradient
              colors={[BRAND_LIGHT, BRAND_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitButton}
            >
              {placingOrder ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.submitButtonText}>Processing Order...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <ShieldCheck size={18} color="#ffffff" />
                  <Text style={styles.submitButtonText}>
                    {paymentMethod === "COD"
                      ? "Place Order"
                      : "Continue to Payment"}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Pressable>
        )}
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

type Styles = {
  card: ViewStyle;
  header: ViewStyle;
  headerLeft: ViewStyle;
  badge: ViewStyle;
  badgeText: TextStyle;
  headerTitle: TextStyle;
  headerCount: TextStyle;
  body: ViewStyle;
  row: ViewStyle;
  rowLabel: TextStyle;
  freeBadgeWrapper: ViewStyle;
  freeBadge: TextStyle;
  methodBadge: ViewStyle;
  methodText: TextStyle;
  totalRow: ViewStyle;
  totalLabel: TextStyle;
  taxSubtext: TextStyle;
  totalValueWrapper: ViewStyle;
  warningBox: ViewStyle;
  warningText: TextStyle;
  actionWrapper: ViewStyle;
  submitButtonWrapper: ViewStyle;
  submitButton: ViewStyle;
  buttonDisabled: ViewStyle;
  submitButtonText: TextStyle;
  buttonContent: ViewStyle;
  loadingContainer: ViewStyle;
  pressedState: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingBottom: 14,
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: BRAND_DARK,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: BRAND_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerCount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
  },
  body: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },
  freeBadgeWrapper: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  freeBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: BRAND_LIGHT,
    textTransform: "uppercase",
  },
  methodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  methodText: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_DARK,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 14,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: BRAND_DARK,
  },
  taxSubtext: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 1,
  },
  totalValueWrapper: {
    alignItems: "flex-end",
  },
  warningBox: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  warningText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400e",
    lineHeight: 17,
    flex: 1,
  },
  actionWrapper: {
    marginTop: 4,
  },
  submitButtonWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 6,
    shadowColor: BRAND_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  submitButton: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    opacity: 0.55,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pressedState: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
});