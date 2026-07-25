import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import type { Category } from "@africasuk/types";

interface HeroProps {
  categories?: Category[];
}

const { width } = Dimensions.get("window");

export default function Hero({ categories = [] }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!categories.length) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [categories]);

  if (!categories.length) return null;

  const current = categories[activeIndex];

  return (
    <View style={styles.container}>
      {current.imageUrl ? (
        <Image
            source={{ uri: current.imageUrl }}
            style={styles.image}
            resizeMode="cover"
        />
        ) : (
        <View style={[styles.image, { backgroundColor: "#eee" }]} />
        )}

      <View style={styles.overlay}>
        <Text style={styles.counter}>
          {activeIndex + 1} / {categories.length}
        </Text>

        <Text style={styles.title}>{current.name}</Text>

        <Text style={styles.description} numberOfLines={3}>
          {current.description}
        </Text>

        <Pressable
          style={styles.button}
          onPress={() =>
            router.push(`/categories/${current.slug}` as never)
          }
        >
          <Text style={styles.buttonText}>Explore Collection</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 4,
  },

  image: {
    width: width - 32,
    height: 320,
  },

  overlay: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
  },

  counter: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
  },

  description: {
    color: "#fff",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },

  button: {
    marginTop: 20,
    backgroundColor: "#005c2e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});