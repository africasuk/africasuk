
import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { Check, MapPin, Truck } from "lucide-react-native";
import { useCheckout } from "./CheckoutContext";
import type { FulfillmentMethod } from "./CheckoutContext";

export default function CheckoutFulfillment() {
  const { fulfillmentMethod, setFulfillmentMethod } = useCheckout();

const options: {
  value: FulfillmentMethod;
  title: string;
  description: string;
  fee: string;
}[] = [
  {
    value: "PICKUP",
    title: "Meet at an Agreed Location",
    description:
      "Meet our team at a mutually agreed location when available. No delivery fee.",
    fee: "FREE",
  },
  {
    value: "DELIVERY",
    title: "Home Delivery",
    description:
      "Delivery is paid. Our team will confirm the delivery fee after your order is placed, based on the delivery distance.",
    fee: "PAID",
  },
];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Delivery Method</Text>
        <Text style={styles.required}>REQUIRED</Text>
      </View>

      <Text style={styles.subtitle}>
        Choose how you would like to receive your order.
      </Text>

      <View style={styles.options}>
        {options.map((option) => {
          const selected = fulfillmentMethod === option.value;
          const isPickup = option.value === "PICKUP";

          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => setFulfillmentMethod(option.value)}
              style={[
                styles.option,
                selected && styles.optionSelected,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  selected && styles.iconContainerSelected,
                ]}
              >
                {isPickup ? (
                  <MapPin
                    size={21}
                    color={selected ? "#047857" : "#71717a"}
                  />
                ) : (
                  <Truck
                    size={21}
                    color={selected ? "#047857" : "#71717a"}
                  />
                )}
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>
                  {option.title}
                </Text>

                <Text style={styles.description}>
                  {option.description}
                </Text>
              </View>

              <View style={styles.rightContent}>
                <View
                  style={[
                    styles.feeBadge,
                    isPickup ? styles.freeBadge : styles.paidBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.feeText,
                      isPickup ? styles.freeText : styles.paidText,
                    ]}
                  >
                    {option.fee}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radio,
                    selected && styles.radioSelected,
                  ]}
                >
                  {selected && (
                    <Check size={12} color="#ffffff" strokeWidth={3} />
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {!fulfillmentMethod && (
        <Text style={styles.validation}>
          Please select a delivery method to continue.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18181b",
  },
  required: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: "#71717a",
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: "#71717a",
    marginBottom: 4,
  },
  options: {
    gap: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
  },
  optionSelected: {
    borderColor: "#059669",
    backgroundColor: "#f0fdf4",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerSelected: {
    backgroundColor: "#d1fae5",
  },
  optionContent: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#18181b",
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
    color: "#71717a",
  },
  rightContent: {
    alignItems: "center",
    gap: 9,
  },
  feeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
  },
  freeBadge: {
    backgroundColor: "#d1fae5",
  },
  paidBadge: {
    backgroundColor: "#fef3c7",
  },
  feeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  freeText: {
    color: "#047857",
  },
  paidText: {
    color: "#92400e",
  },
  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#d4d4d8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    backgroundColor: "#059669",
    borderColor: "#059669",
  },
  validation: {
    fontSize: 12,
    color: "#b45309",
    marginTop: 2,
  },
});
