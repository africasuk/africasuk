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
        {/* Icon Frame - Sharp Corners */}
        <View style={styles.iconWrapper}>
          <TriangleAlert size={52} color={BRAND} />
        </View>

        <Text style={styles.code}>404</Text>

        <Text style={styles.title}>
          Oops! We couldn&apos;t find that page.
        </Text>

        <Text style={styles.description}>
          The page you&apos;re looking for may have been removed,
          renamed, or doesn&apos;t exist.
        </Text>

        {/* Action Button - Sharp Corners */}
        <Link href="/(tabs)" asChild>
          <Pressable style={styles.button}>
            <House size={16} color="#ffffff" />
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
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 0, // Sharp corners design language
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  code: {
    fontSize: 44,
    fontWeight: "500", // Non-bold clean weight
    color: BRAND,
    letterSpacing: 1,
  },

  title: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "500", // Non-bold clean weight
    color: "#111827",
    textAlign: "center",
    letterSpacing: 0.2,
  },

  description: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400", // Clean regular weight
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 300,
  },

  button: {
    marginTop: 28,
    backgroundColor: BRAND,
    borderRadius: 0, // Sharp corners design language
    paddingHorizontal: 22,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "500", // Clean regular weight
    fontSize: 13,
    letterSpacing: 0.2,
  },
});