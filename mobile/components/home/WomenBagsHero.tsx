
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
import { LinearGradient } from "expo-linear-gradient";

const BRAND_GREEN = "#005c2e";
const BRAND_GOLD = "#F4C542";

export default function WomenBagsHero() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/women-bags.jpg")}
        style={styles.hero}
        imageStyle={styles.image}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.02)",
            "rgba(0,0,0,0.08)",
            "rgba(0,0,0,0.55)",
          ]}
          locations={[0, 0.45, 1]}
          style={styles.overlay}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              Your Style,{"\n"}Your Bag
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() =>
                router.push("/categories/womens-luxury-bags" as never)
              }
            >
              <Text style={styles.buttonText}>
                Explore Women’s Bags
              </Text>

              <View style={styles.arrowContainer}>
                <ArrowRight
                  size={18}
                  color={BRAND_GREEN}
                  strokeWidth={2.5}
                />
              </View>
            </Pressable>
          </View>
        </LinearGradient>
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
    height: 520,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: "#E8E8E8",
  },

  image: {
    resizeMode: "cover",
    borderRadius: 20,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingBottom: 30,
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
    color: "#FFFFFF",
    fontFamily: "Georgia",
    fontSize: 32,
    lineHeight: 39,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.2,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },



  buttonContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },

  button: {
    minHeight: 52,
    paddingLeft: 22,
    paddingRight: 6,
    borderRadius: 14,
    backgroundColor: BRAND_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: BRAND_GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
});
