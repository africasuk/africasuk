import { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";

export default function LoadingText() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length === 3 ? "" : d + "."));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text style={styles.text}>
      Loading{dots}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
    color: "#004d26",
  },
});