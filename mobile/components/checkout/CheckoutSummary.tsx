
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

export default function CheckoutSummary({
  profile,
}: CheckoutSummaryProps) {
  const [placingOrder, setPlacingOrder] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);

  const {
    paymentMethod,
    selectedAddress,
    fulfillmentMethod,
  } = useCheckout();

  const items = useCart((state) => state.items);
  const clear = useCart((state) => state.clear);

  const hasAddress = selectedAddress !== null;

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0,
  );

  // The admin determines the home delivery fee after the order.
  // Pickup is always free.
  const shipping = fulfillmentMethod === "PICKUP" ? 0 : 0;
  const tax = 0;
  const total = subtotal + shipping + tax;

    async function handlePlaceOrder() {
      if (!fulfillmentMethod) {
        Alert.alert(
          "Delivery Method Required",
          "Please select Home Delivery or Meet at an Agreed Location before placing your order.",
        );
        return;
      }
    if (!selectedAddress) {
      Alert.alert(
        "Delivery Address",
        "Please add or select a delivery address.",
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
      Alert.alert(
        "Street Address",
        "Please enter your street address.",
      );
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
        fulfillmentMethod,
        subtotal,
        shipping,
        tax,
        total,
      });

      clear();

      router.replace(
        `/order-success?orderNumber=${encodeURIComponent(
          order.orderNumber,
        )}` as Href,
      );
    } catch (error) {
      console.error("Place Order Error:", error);

      Alert.alert(
        "Order Failed",
        error instanceof Error
          ? error.message
          : "Failed to place order.",
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Total Price */}
      <View style={styles.priceHeroCard}>
        <View style={styles.priceHeroLeft}>
          <Text style={styles.priceHeroLabel}>
            Total Payable
          </Text>

          <Text style={styles.taxInclusiveText}>
            Product total before delivery fee
          </Text>
        </View>

        <Price
          price={total}
          style={styles.priceHeroValue}
        />
      </View>

      {/* Order Summary */}
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>
            Order Summary
          </Text>

          <Text style={styles.headerCount}>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </Text>
        </View>

        <View style={styles.body}>
          {/* Subtotal */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Subtotal</Text>

            <Price
              price={subtotal}
              style={styles.rowValue}
            />
          </View>

          {/* Fulfillment Method */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Delivery Method
            </Text>

            <View
              style={[
                styles.fulfillmentTag,
                fulfillmentMethod === "PICKUP"
                  ? styles.pickupTag
                  : fulfillmentMethod === "DELIVERY"
                    ? styles.deliveryTag
                    : styles.unselectedTag,
              ]}
            >
              <Text style={styles.fulfillmentTagText}>
                {fulfillmentMethod === "PICKUP"
                  ? "OFFICE PICKUP"
                  : fulfillmentMethod === "DELIVERY"
                    ? "HOME DELIVERY"
                    : "SELECT METHOD"}
              </Text>
            </View>
          </View>

          {/* Delivery Fee */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              {fulfillmentMethod === "PICKUP"
                ? "Pickup Fee"
                : "Delivery Fee"}
            </Text>

            <Text
              style={[
                styles.rowValue,
                fulfillmentMethod === "PICKUP" &&
                  styles.freeText,
              ]}
            >
              {fulfillmentMethod === "PICKUP"
                ? "FREE"
                : fulfillmentMethod === "DELIVERY"
                  ? "To be confirmed"
                  : "Not selected"}
            </Text>
          </View>

          {fulfillmentMethod === "DELIVERY" && (
            <View style={styles.deliveryNote}>
              <AlertCircle
                size={15}
                color="#92400e"
                strokeWidth={2}
              />

              <Text style={styles.deliveryNoteText}>
                Our team will confirm your delivery fee based
                on the distance. The fee is not included in
                the total yet.
              </Text>
            </View>
          )}

          {/* Tax */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Estimated Tax
            </Text>

            <View style={styles.neutralPill}>
              <Text style={styles.neutralPillText}>
                CALCULATED AT CHECKOUT
              </Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>
              Payment Method
            </Text>

            <View style={styles.paymentMethodTag}>
              {paymentMethod === "COD" ? (
                <>
                  <Wallet
                    size={13}
                    color="#27272a"
                    strokeWidth={2}
                  />

                  <Text style={styles.paymentMethodText}>
                    Order with Cash
                  </Text>
                </>
              ) : (
                <>
                  <CreditCard
                    size={13}
                    color="#27272a"
                    strokeWidth={2}
                  />

                  <Text style={styles.paymentMethodText}>
                    Online Payment
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* Missing Fulfillment Warning */}
          {!fulfillmentMethod && (
            <View style={styles.warningBox}>
              <AlertCircle
                size={15}
                color="#b45309"
                strokeWidth={2}
              />

              <Text style={styles.warningText}>
                Select Home Delivery or Meet at an Agreed Location before
                placing your order.
              </Text>
            </View>
          )}

          {/* Missing Address Warning */}
          {!hasAddress && (
            <View style={styles.warningBox}>
              <AlertCircle
                size={15}
                color="#b45309"
                strokeWidth={2}
              />

              <Text style={styles.warningText}>
                Select a delivery destination to place your
                order.
              </Text>
            </View>
          )}

          {/* Place Order */}
          {!hasAddress ? (
            <View style={styles.actionWrapper}>
              <AddAddressDialog />
            </View>
          ) : (
            <Pressable
              disabled={
                items.length === 0 ||
                placingOrder ||
                !fulfillmentMethod
              }
              onPress={handlePlaceOrder}
              style={({ pressed }) => [
                styles.submitButton,
                (items.length === 0 ||
                  placingOrder ||
                  !fulfillmentMethod) &&
                  styles.buttonDisabled,
                pressed &&
                  !placingOrder &&
                  fulfillmentMethod &&
                  styles.pressedState,
              ]}
            >
              {placingOrder ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    color="#ffffff"
                    size="small"
                  />

                  <Text style={styles.submitButtonText}>
                    Processing Order...
                  </Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.submitButtonText}>
                    {paymentMethod === "COD"
                      ? "Place Order"
                      : "Continue to Payment"}
                  </Text>

                  <ArrowRight
                    size={15}
                    color="#ffffff"
                    strokeWidth={2}
                  />
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
    flex: 1,
    marginRight: 8,
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
    gap: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },

  rowLabel: {
    flexShrink: 1,
    fontSize: 13,
    color: "#71717a",
    fontWeight: "500",
  },

  rowValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#18181b",
  },

  fulfillmentTag: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    flexShrink: 0,
  },

  pickupTag: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
  },

  deliveryTag: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },

  unselectedTag: {
    backgroundColor: "#f4f4f5",
    borderColor: "#e4e4e7",
  },

  fulfillmentTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#27272a",
    letterSpacing: 0.3,
  },

  freeText: {
    color: "#047857",
    fontWeight: "700",
  },

  deliveryNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#fffbeb",
    padding: 10,
    borderRadius: 8,
  },

  deliveryNoteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: "#92400e",
  },

  neutralPill: {
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    flexShrink: 0,
  },

  neutralPillText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#27272a",
    letterSpacing: 0.3,
  },

  paymentMethodTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f4f4f5",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    flexShrink: 0,
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
    alignItems: "flex-start",
    gap: 8,
  },

  warningText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#92400e",
    flex: 1,
    lineHeight: 18,
  },

  actionWrapper: {
    marginTop: 4,
  },

  submitButton: {
    minHeight: 46,
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
