import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import {
  useRouter,
  useFocusEffect,
} from "expo-router";

export default function SSPCurrencyHero() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Reset loading whenever this screen becomes active again
  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, []),
  );

  const handlePress = () => {
    if (loading) return;

    setLoading(true);

    router.push("/products");
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
          source={require("@/assets/images/ssp-shop-banner.jpg")}
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
    backgroundColor: "rgba(0, 0, 0, 0.28)",
    alignItems: "center",
    justifyContent: "center",
  },
});