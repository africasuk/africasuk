import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Href } from "expo-router";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { createClient } from "@/lib/auth/client";

const supabase = createClient();

export default function ResetPasswordScreen() {
  const { dictionary } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert("Success", "Your password has been updated successfully.");
      router.replace("/auth/login" as Href);
    } catch {
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <Logo />
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter and confirm your new account password below.
          </Text>
        </View>

        {/* Inputs */}
        <View style={styles.formGroup}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{dictionary.auth.password}</Text>
            <TextInput
              secureTextEntry
              value={password}
              editable={!loading}
              placeholder="Enter new password"
              placeholderTextColor="#a1a1aa"
              onChangeText={setPassword}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{dictionary.auth.confirmPassword}</Text>
            <TextInput
              secureTextEntry
              value={confirmPassword}
              editable={!loading}
              placeholder="Re-enter new password"
              placeholderTextColor="#a1a1aa"
              onChangeText={setConfirmPassword}
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          {/* Submit Button */}
          <Pressable
            disabled={loading}
            onPress={handleReset}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && !loading && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Update Password</Text>
                <ArrowRight size={14} color="#ffffff" strokeWidth={2} />
              </>
            )}
          </Pressable>
        </View>

        {/* Back to Login */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => router.replace("/auth/login" as Href)}
          hitSlop={6}
        >
          <ArrowLeft size={14} color="#18181b" strokeWidth={2} />
          <Text style={styles.backText}>{dictionary.auth.login}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
  },

  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    gap: 20,
  },

  header: {
    alignItems: "center",
    gap: 4,
  },

  logoWrapper: {
    marginBottom: 8,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.4,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
    textAlign: "center",
    lineHeight: 17,
    maxWidth: 280,
  },

  formGroup: {
    gap: 14,
    width: "100%",
  },

  inputContainer: {
    width: "100%",
    gap: 6,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#27272a",
    letterSpacing: -0.1,
  },

  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    paddingHorizontal: 13,
    fontSize: 13,
    color: "#18181b",
  },

  submitButton: {
    height: 44,
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#18181b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },

  submitButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    letterSpacing: -0.1,
  },

  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },

  buttonDisabled: {
    opacity: 0.45,
  },

  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingTop: 4,
  },

  backButtonPressed: {
    opacity: 0.7,
  },

  backText: {
    color: "#18181b",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: -0.1,
  },
});