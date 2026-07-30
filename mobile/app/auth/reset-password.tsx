import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { router, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { createClient } from "@/lib/auth/client";

const supabase = createClient();

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const BORDER_COLOR = "#e5e7eb";
const TEXT_MUTED = "#6b7280";

export default function ResetPasswordScreen() {
  const { dictionary } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (password !== confirmPassword) {
      Alert.alert("Error", dictionary.auth.passwordsDoNotMatch);
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", dictionary.auth.passwordMinLength);
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

      Alert.alert("Success", dictionary.auth.passwordUpdated);

      router.replace("/auth/login" as Href);
    } catch {
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Brand Header Stack */}
        <View style={styles.headerStack}>
          <View style={styles.logoWrapper}>
            <Logo />
          </View>
          <Text style={styles.title}>
            {dictionary.auth.resetPasswordTitle}
          </Text>
          <Text style={styles.description}>
            {dictionary.auth.resetPasswordDescription}
          </Text>
        </View>

        {/* Inputs */}
        <View style={styles.formGroup}>
          <TextInput
            secureTextEntry
            value={password}
            editable={!loading}
            placeholder={dictionary.auth.newPassword}
            placeholderTextColor="#9ca3af"
            onChangeText={setPassword}
            style={styles.input}
          />

          <TextInput
            secureTextEntry
            value={confirmPassword}
            editable={!loading}
            placeholder={dictionary.auth.confirmPassword}
            placeholderTextColor="#9ca3af"
            onChangeText={setConfirmPassword}
            style={styles.input}
          />

          {/* Primary Action Button */}
          <Pressable
            disabled={loading}
            onPress={handleReset}
            style={({ pressed }) => [
              styles.submitButtonWrapper,
              pressed && !loading && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            <LinearGradient
              colors={[BRAND_LIGHT, BRAND_DARK]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitButton}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {dictionary.auth.updatePassword}
                </Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>

        {/* Back to Login */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/auth/login" as Href)}
        >
          <ArrowLeft size={16} color={BRAND_LIGHT} />
          <Text style={styles.backText}>{dictionary.auth.login}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

type Styles = {
  container: ViewStyle;
  card: ViewStyle;
  headerStack: ViewStyle;
  logoWrapper: ViewStyle;
  title: TextStyle;
  description: TextStyle;
  formGroup: ViewStyle;
  input: TextStyle;
  submitButtonWrapper: ViewStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
  backButton: ViewStyle;
  backText: TextStyle;
  buttonPressed: ViewStyle;
  buttonDisabled: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#f9fafb",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  headerStack: {
    alignItems: "flex-start",
    marginBottom: 16,
  },
  logoWrapper: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: BRAND_DARK,
    letterSpacing: -0.4,
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: TEXT_MUTED,
  },
  formGroup: {
    gap: 12,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  submitButtonWrapper: {
    marginTop: 6,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: BRAND_LIGHT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  submitButton: {
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  backButton: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  backText: {
    color: BRAND_LIGHT,
    fontWeight: "800",
    fontSize: 13,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});