import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

export default function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((current) => (current.length >= 3 ? "" : current + "."));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/loading.png")}
        style={styles.image}
        contentFit="contain"
      />

      <Text style={styles.loadingText}>
        Loading{dots}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 320,
    height: 320,
  },

  loadingText: {
    marginTop: -25,
    fontSize: 16,
    fontWeight: "600",
    color: "#024F25",
    letterSpacing: 1,
  },
});