import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import type { Brand } from "@africasuk/types";

interface Props {
  brands?: (Brand & { description?: string })[];
}

export default function FeaturedBrands({ brands = [] }: Props) {
  if (!brands.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular Brands</Text>

        <Pressable onPress={() => router.push("/brands" as never)}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <FlatList
        data={brands.slice(0, 6)}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push(`/brands/${item.slug}` as never)
            }
          >
            <View style={styles.logoContainer}>
              {item.logoUrl ? (
                <Image
                  source={{ uri: item.logoUrl }}
                  style={styles.logo}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
              )}
            </View>

            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>

            <Text numberOfLines={2} style={styles.description}>
              {item.description ?? `Shop ${item.name}`}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
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

  viewAll: {
    color: "#005c2e",
    fontWeight: "700",
  },

  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  logoContainer: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 70,
    height: 70,
  },

  placeholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#005c2e",
  },

  name: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
  },

  description: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
});