import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { Stack, useRouter } from "expo-router";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Configure native navigation header */}
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Login",
        }}
      />

      {/* Back to Home Button */}
      <Pressable
        style={styles.homeButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.homeButtonText}>← Back to Home</Text>
      </Pressable>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LoginForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
  homeButton: ViewStyle;
  homeButtonText: TextStyle;
  keyboardView: ViewStyle;
  scrollContent: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f5", // Matches bg-muted/30 context
  },
  homeButton: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  homeButtonText: {
    fontSize: 14,
    color: "#004d26",
    fontWeight: "500", // Clean unbolded design language
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});