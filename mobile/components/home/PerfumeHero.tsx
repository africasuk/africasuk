import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";

export default function PerfumeHero() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/yara-perfume-hero.jpg")}
        style={styles.hero}
        imageStyle={styles.image}
      >
        <View style={styles.overlay} />

        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              router.push("/categories/fragrance")
            }
          >
            <Text style={styles.buttonText}>
              Explore Fragrances
            </Text>

            <ArrowRight
              size={17}
              color="#ffffff"
              strokeWidth={2}
            />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden",
  },

  hero: {
    height: 540,
    width: "100%",
    position: "relative",
  },

  image: {
    resizeMode: "cover",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20, 0, 10, 0.04)",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  button: {
    height: 46,
    paddingHorizontal: 21,
    borderRadius: 14,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#D4A84F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  buttonPressed: {
    opacity: 0.82,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
});