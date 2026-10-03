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

export default function WomenBagsHero() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/women-bags.jpg")}
        style={styles.hero}
        imageStyle={styles.image}
      >
        <View style={styles.overlay} />

        {/* Headline */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Your Style,
            {"\n"}
            Your Bag
          </Text>
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/categories/women-bags")}
          >
            <Text style={styles.buttonText}>
              Explore Women’s Bags
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
    borderRadius: 18,
    overflow: "hidden",
  },

  hero: {
    height: 520,
    width: "100%",
    position: "relative",
  },

  image: {
    resizeMode: "cover",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },

  titleContainer: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    color: "#ffffff",
    fontFamily: "Georgia",
    fontSize: 30,
    lineHeight: 37,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.2,
    textShadowColor: "rgba(0, 0, 0, 0.45)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 5,
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
    paddingHorizontal: 20,
    borderRadius: 13,
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
    fontWeight: "600",
  },
});