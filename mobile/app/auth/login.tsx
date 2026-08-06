import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Stack } from "expo-router";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Configure native navigation header */}
      <Stack.Screen
        options={{
          headerShown: false,
          title: "Login",
        }}
      />

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
  keyboardView: ViewStyle;
  scrollContent: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f5", // Matches bg-muted/30 context
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