import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { useCart } from "@/store/cart";

import ContinueShoppingCard from "./ContinueShoppingCard";

export default function ContinueShopping() {
  const items = useCart((state) => state.items);

  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Continue Shopping</Text>
          <Text style={styles.description}>
            You have {items.length}{" "}
            {items.length === 1 ? "item" : "items"} waiting in your cart.
          </Text>
        </View>

        <Pressable onPress={() => router.push("/cart" as never)}>
          <Text style={styles.viewCart}>View Cart</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item) => item.variantId}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <ContinueShoppingCard item={item} />
        )}
      />

      <Pressable
        style={styles.checkoutButton}
        onPress={() => router.push("/checkout" as never)}
      >
        <Text style={styles.checkoutText}>
          Continue to Checkout
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f4f4f4",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
  },

  description: {
    marginTop: 4,
    color: "#666",
  },

  viewCart: {
    color: "#004d26",
    fontWeight: "700",
  },

  checkoutButton: {
    marginTop: 20,
    backgroundColor: "#004d26",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  checkoutText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});