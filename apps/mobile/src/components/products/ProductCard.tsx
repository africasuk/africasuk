import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import type { ProductWithDetails } from "@africasuk/types";
import { Price } from "../currency/Price";



interface Props {
  product: ProductWithDetails & {
    selectedColorId?: string;
  };
}

export default function ProductCard({ product }: Props) {
  const color =
    product.colors.find((c) => c.id === product.selectedColorId) ??
    product.colors[0];

  const image = color?.images?.[0]?.imageUrl;

  const price =
    color?.variants?.[0]?.price ??
    product.colors.flatMap((c) => c.variants ?? [])[0]?.price ??
    0;

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push(
          `/products/${product.slug}${color?.id ? `?color=${color.id}` : ""}` as never
        )
      }
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={[styles.image, { backgroundColor: "#eee" }]} />
      )}

      <View style={styles.content}>
        {!!product.brand?.name && (
          <Text style={styles.brand}>{product.brand.name}</Text>
        )}

        <Text numberOfLines={1} style={styles.name}>
          {product.name}
        </Text>

        <View style={styles.bottom}>
          <Price price={Number(price)} />

          <View style={styles.colors}>
            {product.colors.slice(0, 4).map((c) => (
              <View
                key={c.id}
                style={[
                  styles.dot,
                  {
                    backgroundColor: c.hexCode ?? "#ccc",
                    borderWidth: c.id === color?.id ? 2 : 0,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </Pressable>
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
    height: 180,
  },

  content: {
    padding: 10,
  },

  brand: {
    fontSize: 10,
    color: "#777",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  name: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },

  bottom: {
    marginTop: 8,
  },

  colors: {
    flexDirection: "row",
    marginTop: 8,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
    borderColor: "#005c2e",
  },
});