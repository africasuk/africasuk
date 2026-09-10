import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import * as Linking from "expo-linking";
import { ArrowRight } from "lucide-react-native";

import { createClient } from "@/lib/auth/client";
import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validation/login";
import Logo from "@/components/layout/header/Logo";

interface LoginFormProps {
  onSuccess?: () => void | Promise<void>;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const redirectTo = redirect ?? "/";

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
        return;
      }

      if (onSuccess) {
        await onSuccess();
      } else {
        router.replace(redirectTo as Href);
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 20}
      style={styles.keyboardAvoid}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.scrollContent,
          { justifyContent: isKeyboardVisible ? "flex-start" : "center" },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          {/* Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <Logo />
            </View>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to access your orders, saved addresses, and wishlist
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formGroup}>
            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="name@example.com"
                    placeholderTextColor="#a1a1aa"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password Field */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <Pressable
                  onPress={() =>
                    Linking.openURL(
                      "https://www.africasuk.com/auth/forgot-password"
                    )
                  }
                  hitSlop={6}
                >
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </Pressable>
              </View>

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Enter your password"
                    placeholderTextColor="#a1a1aa"
                    secureTextEntry
                    onFocus={() => {
                      setTimeout(() => {
                        scrollRef.current?.scrollToEnd({ animated: true });
                      }, 120);
                    }}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Submit Action */}
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && !isSubmitting && styles.buttonPressed,
                isSubmitting && styles.disabled,
              ]}
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Sign In</Text>
                  <ArrowRight size={14} color="#ffffff" strokeWidth={2} />
                </>
              )}
            </Pressable>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <Pressable
              onPress={() => router.push("/auth/signup" as Href)}
              hitSlop={6}
            >
              <Text style={styles.signUpText}>Create Account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    width: "100%",
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 16,
  },

  container: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    padding: 20,
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

  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  inputError: {
    borderColor: "#fca5a5",
    backgroundColor: "#fef2f2",
  },

  errorText: {
    fontSize: 11,
    color: "#dc2626",
    fontWeight: "500",
  },

  forgotText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a",
  },

  submitButton: {
    height: 44,
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

  disabled: {
    opacity: 0.45,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingTop: 4,
  },

  footerText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
  },

  signUpText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.1,
  },
});