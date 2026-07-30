import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";

import Logo from "@/components/layout/header/Logo";
import { forgotPassword } from "@/lib/auth/forgot-password";

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const BORDER_COLOR = "#e5e7eb";
const TEXT_MUTED = "#6b7280";

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await forgotPassword(email);

      setLoading(false);

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert(
        "Success",
        "A password reset link has been sent to your email."
      );
    } catch {
      setLoading(false);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Brand Header Stack */}
        <View style={styles.headerStack}>
          <View style={styles.logoWrapper}>
            <Logo />
          </View>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we&apos;ll send you a password reset link.
          </Text>
        </View>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        {/* Primary Call to Action with Brand Gradient */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButtonWrapper,
            pressed && !loading && styles.buttonPressed,
            loading && styles.disabled,
          ]}
          disabled={loading}
          onPress={handleReset}
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
              <Text style={styles.submitButtonText}>Send Reset Link</Text>
            )}
          </LinearGradient>
        </Pressable>

        {/* Back to Login Action */}
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/auth/login" as Href)}
        >
          <ArrowLeft size={16} color={BRAND_LIGHT} />
          <Text style={styles.backText}>Back to Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  card: ViewStyle;
  headerStack: ViewStyle;
  logoWrapper: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  input: TextStyle;
  submitButtonWrapper: ViewStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
  backButton: ViewStyle;
  backText: TextStyle;
  buttonPressed: ViewStyle;
  disabled: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
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
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: TEXT_MUTED,
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    fontSize: 13,
    color: "#111827",
  },
  submitButtonWrapper: {
    marginTop: 16,
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
  disabled: {
    opacity: 0.5,
  },
});