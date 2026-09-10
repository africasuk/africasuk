import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bottomInset = insets.bottom > 0 ? insets.bottom : 16;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Login",
        }}
      />

      {/* Back Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.replace("/")}
          hitSlop={8}
        >
          <ArrowLeft size={16} color="#18181b" strokeWidth={2} />
          <Text style={styles.backButtonText}>Home</Text>
        </Pressable>
      </View>

      {/* Form Container */}
      <View style={[styles.contentWrapper, { paddingBottom: bottomInset }]}>
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  navBar: {
    height: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 8,
  },

  backButtonPressed: {
    backgroundColor: "#e4e4e7",
    transform: [{ scale: 0.97 }],
  },

  backButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#18181b",
    letterSpacing: -0.1,
  },

  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
});