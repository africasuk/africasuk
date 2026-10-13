import React from "react";

import {
  ActivityIndicator,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

export default function LoadingSplash() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/auth-bg.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            "rgba(0,92,46,0.55)",
            "rgba(0,92,46,0.45)",
            "rgba(0,92,46,0.38)",
            "rgba(0,92,46,0.62)",
            "rgba(0,92,46,0.97)",
          ]}
          locations={[0, 0.2, 0.42, 0.68, 1]}
          style={styles.overlay}
        />

        <View style={styles.content}>
          <View style={styles.brand}>
            <Text style={styles.brandText}>
              AFRICA SUK
            </Text>

            <Text style={styles.tagline}>
              SHOP WITH CONFIDENCE
            </Text>
          </View>

          <View style={styles.center}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <Text style={styles.loadingText}>
              Loading...
            </Text>

            <ActivityIndicator
              size="small"
              color="#ffffff"
              style={styles.loader}
            />
          </View>

          <View style={styles.bottom}>
            <Text style={styles.bottomText}>
              Shop with Confidence
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#005c2e",
  },

  background: {
    flex: 1,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 35,
    justifyContent: "space-between",
  },

  brand: {
    alignItems: "center",
  },

  brandText: {
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: "#ffffff",
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 5,
  },

  tagline: {
    marginTop: 5,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#f5c542",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 180,
    height: 80,
  },

  loadingText: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },

  loader: {
    marginTop: 18,
  },

  bottom: {
    alignItems: "center",
  },

  bottomText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
});