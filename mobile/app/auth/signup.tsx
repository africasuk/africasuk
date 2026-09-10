import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, Href } from "expo-router";
import { ArrowRight } from "lucide-react-native";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider";
import {
  signupSchema,
  type SignupFormData,
} from "@/lib/validation/signup";
import { signUp } from "@/lib/auth/signup";

export default function SignupPage() {
  const router = useRouter();
  const { dictionary } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { error } = await signUp({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      Alert.alert("Success", dictionary.auth.welcomeToAfricaSuk);
      reset();
      router.push("/");
    } catch (err: any) {
      Alert.alert("Error", err.message || "An unexpected error occurred.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Card Container */}
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoWrapper}>
              <Logo />
            </View>
            <Text style={styles.title}>{dictionary.auth.signupTitle}</Text>
            <Text style={styles.subtitle}>{dictionary.auth.signupSubtitle}</Text>
          </View>

          {/* Form Group */}
          <View style={styles.formGroup}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{dictionary.auth.fullName}</Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.fullName && styles.inputError]}
                    placeholder="Enter your full name"
                    placeholderTextColor="#a1a1aa"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName.message}</Text>
              )}
            </View>

            {/* Email Address */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{dictionary.auth.emailAddress}</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="name@example.com"
                    placeholderTextColor="#a1a1aa"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{dictionary.auth.password}</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="Create a strong password"
                    placeholderTextColor="#a1a1aa"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{dictionary.auth.confirmPassword}</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.confirmPassword && styles.inputError,
                    ]}
                    placeholder="Re-enter your password"
                    placeholderTextColor="#a1a1aa"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && !isSubmitting && styles.buttonPressed,
                isSubmitting && styles.disabled,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>
                    {dictionary.auth.createAccount}
                  </Text>
                  <ArrowRight size={14} color="#ffffff" strokeWidth={2} />
                </>
              )}
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              {dictionary.auth.alreadyHaveAccount}{" "}
            </Text>
            <Pressable
              onPress={() => router.push("/auth/login" as Href)}
              hitSlop={6}
            >
              <Text style={styles.loginLink}>{dictionary.auth.login}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
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
    width: "100%",
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

  disabled: {
    opacity: 0.45,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingTop: 4,
  },

  footerText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#71717a",
  },

  loginLink: {
    fontSize: 12,
    fontWeight: "700",
    color: "#18181b",
    letterSpacing: -0.1,
  },
});