import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";

import type { CartItem } from "@/types/cart";

import { Price } from "@/components/currency/Price";

interface Props {
  item: CartItem;
}

export default function ContinueShoppingCard({ item }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={() =>
          router.push(`/products/${item.slug}` as never)
        }
      >
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </Pressable>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.name}>
          {item.name}
        </Text>

        {item.options?.length > 0 && (
          <View style={styles.options}>
            {item.options.map((option) => (
              <View
                key={`${option.optionName}-${option.value}`}
                style={styles.badge}
              >
                <Text style={styles.badgeText}>
                  {option.optionName}: {option.value}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.summary}>
          <View>
            <Text style={styles.label}>Quantity</Text>
            <Text style={styles.value}>
              ×{item.quantity}
            </Text>
          </View>

          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>Total</Text>
            <Price
              price={item.price * item.quantity}
              style={styles.price}
            />
          </View>
        </View>

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push("/checkout" as never)
          }
        >
          <Text style={styles.buttonText}>
            Continue Checkout
          </Text>

          <ArrowRight
            size={16}
            color="#ffffff"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
  },

  image: {
    width: "100%",
    height: 170,
  },

  content: {
    padding: 12,
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 10,
  },

  badge: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },

  badgeText: {
    fontSize: 10,
    color: "#666",
  },

  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },

  label: {
    fontSize: 10,
    color: "#888",
  },

  value: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
  },

  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#002b15",
    marginTop: 2,
  },

  button: {
    backgroundColor: "#002b15",
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});