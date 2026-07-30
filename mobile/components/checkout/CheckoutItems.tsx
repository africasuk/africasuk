import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ShoppingBag, ArrowRight } from "lucide-react-native";

import { Price } from "@/components/currency/Price";
import { useCart } from "@/store/cart";

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const LIGHT_GREEN = "#ecfdf5";

export default function CheckoutItems() {
  const items = useCart((state) => state.items);

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <ShoppingBag size={28} color={BRAND_LIGHT} />
        </View>

        <Text style={styles.emptyTitle}>Your cart is empty</Text>

        <Text style={styles.emptySubtitle}>
          Add products before proceeding to checkout.
        </Text>

        <Pressable
          onPress={() => router.replace("/")}
          style={styles.emptyButtonWrapper}
        >
          <LinearGradient
            colors={[BRAND_LIGHT, BRAND_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyButton}
          >
            <Text style={styles.shoppingLink}>Continue Shopping</Text>
            <ArrowRight size={16} color="#ffffff" />
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View
          key={item.variantId}
          style={[
            styles.item,
            index !== items.length - 1 && styles.itemBorder,
          ]}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: item.image,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.content}>
            <View style={styles.left}>
              <Text numberOfLines={2} style={styles.name}>
                {item.name}
              </Text>

              {item.options.length > 0 && (
                <View style={styles.options}>
                  {item.options.map((option) => (
                    <View
                      key={`${option.optionName}-${option.value}`}
                      style={styles.optionBadge}
                    >
                      <Text style={styles.optionText}>
                        <Text style={styles.optionLabel}>{option.optionName}: </Text>
                        {option.value}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.right}>
              <View style={styles.qtyBadge}>
                <Text style={styles.quantity}>Qty: {item.quantity}</Text>
              </View>

              <View style={styles.price}>
                <Price price={item.price * item.quantity} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  item: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },

  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },

  imageWrapper: {
    width: 88,
    height: 88,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
    backgroundColor: "#f9fafb",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  content: {
    flex: 1,
    marginLeft: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  left: {
    flex: 1,
    paddingRight: 10,
    justifyContent: "center",
  },

  right: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 2,
  },

  name: {
    fontSize: 15,
    fontWeight: "800",
    color: BRAND_DARK,
    lineHeight: 20,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },

  optionBadge: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },

  optionLabel: {
    color: "#059669",
    fontWeight: "700",
  },

  optionText: {
    fontSize: 11,
    color: BRAND_DARK,
    fontWeight: "800",
  },

  qtyBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  quantity: {
    fontSize: 12,
    fontWeight: "800",
    color: "#374151",
  },

  price: {
    marginTop: 10,
  },

  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: LIGHT_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: BRAND_DARK,
    letterSpacing: -0.3,
  },

  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },

  emptyButtonWrapper: {
    marginTop: 20,
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
    maxWidth: 240,
  },

  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  shoppingLink: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
});