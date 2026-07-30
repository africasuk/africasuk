import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { ChevronDown } from "lucide-react-native";

export default function ScrollIndicator() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <View pointerEvents="none" style={styles.container}>
      <Animated.View style={{ opacity: 0.3 }}>
        <ChevronDown size={42} color="#004d26" strokeWidth={3.5} />
      </Animated.View>

      <Animated.View style={[styles.middle, { opacity: 0.6 }]}>
        <ChevronDown size={42} color="#004d26" strokeWidth={3.5} />
      </Animated.View>

      <Animated.View style={[styles.bottom, { opacity }]}>
        <ChevronDown size={42} color="#004d26" strokeWidth={3.5} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 30,
  },

  middle: {
    marginTop: -18,
  },

  bottom: {
    marginTop: -18,
  },
});