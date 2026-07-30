import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { TriangleAlert, House } from "lucide-react-native";

const BRAND = "#004d26";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Page Not Found",
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        <View style={styles.iconWrapper}>
          <TriangleAlert size={72} color={BRAND} />
        </View>

        <Text style={styles.code}>404</Text>

        <Text style={styles.title}>
          Oops! We couldn&apos;t find that page.
        </Text>

        <Text style={styles.description}>
          The page you&apos;re looking for may have been removed,
          renamed, or doesn&apos;t exist.
        </Text>

        <Link href="/(tabs)" asChild>
          <Pressable style={styles.button}>
            <House size={18} color="#fff" />
            <Text style={styles.buttonText}>
              Go to Home
            </Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  code: {
    fontSize: 56,
    fontWeight: "800",
    color: BRAND,
  },

  title: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 320,
  },

  button: {
    marginTop: 32,
    backgroundColor: BRAND,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});