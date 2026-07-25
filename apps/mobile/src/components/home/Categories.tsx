import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import type { Category } from "@africasuk/types";

interface Props {
  categories?: (Category & { description?: string })[];
}

export default function Categories({ categories = [] }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop by Category</Text>

        <Pressable onPress={() => router.push("/categories" as never)}>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      <FlatList
        data={categories.slice(0, 6)}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push(`/categories/${item.slug}` as never)
            }
          >
            {item.imageUrl ? (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
              />
            ) : (
              <View style={[styles.image, { backgroundColor: "#ddd" }]} />
            )}

            <View style={styles.overlay}>
              <Text style={styles.name}>{item.name}</Text>

              <Text numberOfLines={2} style={styles.description}>
                {item.description}
              </Text>
            </View>
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
    height: 220,
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  overlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  description: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});