import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

export default function GiftDeliveryHero() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, []),
  );

const handlePress = () => {
  if (loading) return;

  setLoading(true);
  router.push("/categories/gift");
};

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        disabled={loading}
        style={({ pressed }) => [
          styles.pressable,
          pressed && !loading && styles.pressed,
        ]}
      >
        <ImageBackground
          source={require("@/assets/images/gift-delivery.jpg")}
          style={styles.hero}
          imageStyle={styles.image}
        >
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator
                size="large"
                color="#ffffff"
              />
            </View>
          )}
        </ImageBackground>
      </Pressable>
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

  pressable: {
    width: "100%",
  },

  pressed: {
    opacity: 0.92,
  },

  hero: {
    width: "100%",
    aspectRatio: 1.5,
  },

  image: {
    resizeMode: "cover",
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
});