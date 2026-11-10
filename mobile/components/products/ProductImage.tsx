
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ShoppingBag } from "lucide-react-native";

interface ProductImageProps {
  uri?: string | null;
  style?: any;
  contentFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  transition?: number;
}

export function ProductImage({
  uri,
  style,
  contentFit = "cover",
  transition = 200,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [uri]);

  return (
    <View style={[styles.container, style]}>
      {(!loaded || failed || !uri) && (
        <View style={styles.placeholder}>
          <View style={styles.iconContainer}>
            <ShoppingBag size={30} color="#006341" strokeWidth={1.5} />
          </View>
          <Text style={styles.brand}>Africa Suk</Text>
        </View>
      )}

      {!!uri && !failed && (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFillObject}
          contentFit={contentFit}
          transition={transition}
          cachePolicy="memory-disk"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setFailed(true);
            setLoaded(false);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#F5F6F4",
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F6F4",
    gap: 7,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#E8F0EB",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    color: "#8A9690",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
