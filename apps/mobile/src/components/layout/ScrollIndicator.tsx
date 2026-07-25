import { Animated, StyleSheet } from "react-native";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react-native";

export default function ScrollIndicator() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
        },
      ]}
    >
      <ChevronDown size={28} color="#004d26" />
      <ChevronDown size={28} color="#004d26" style={styles.middle} />
      <ChevronDown size={28} color="#004d26" style={styles.bottom} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    alignItems: "center",
  },
  middle: {
    marginTop: -10,
    opacity: 0.7,
  },
  bottom: {
    marginTop: -10,
    opacity: 0.4,
  },
});