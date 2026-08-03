import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider";
import {
  signupSchema,
  type SignupFormData,
} from "@/lib/validation/signup";
import { signUp } from "@/lib/auth/signup";
import { signInWithGoogle } from "@/lib/auth/google";

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";
const BORDER_COLOR = "#e5e7eb";
const TEXT_MUTED = "#6b7280";
const DESTRUCTIVE = "#ef4444";

// Google SVG Brand Logo Icon
function GoogleLogo({ size = 18 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export default function SignupScreen() {
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
        Alert.alert("Signup Error", error.message);
        return;
      }

      Alert.alert("Success", dictionary.auth.welcomeToAfricaSuk);
      reset();
      router.push("/");
    } catch (err: any) {
      Alert.alert("Error", err.message || "An unexpected error occurred.");
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await signInWithGoogle();

    if (error) {
      Alert.alert("Google Sign In", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Brand Header Stack */}
          <View style={styles.headerStack}>
            <View style={styles.logoWrapper}>
              <Logo />
            </View>
            <Text style={styles.title}>{dictionary.auth.signupTitle}</Text>
            <Text style={styles.subtitle}>{dictionary.auth.signupSubtitle}</Text>
          </View>

          {/* Google Signup Button */}
          <Pressable
            onPress={handleGoogleSignup}
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <View style={styles.googleButtonContent}>
              <GoogleLogo size={18} />
              <Text style={styles.googleButtonText}>
                {dictionary.auth.continueWithGoogle}
              </Text>
            </View>
          </Pressable>

          {/* Geometric Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>{dictionary.auth.or}</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Core Signup Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.fullName && styles.inputError]}
                    placeholder={dictionary.auth.fullName}
                    placeholderTextColor="#9ca3af"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName.message}</Text>
              )}
            </View>

            {/* Email Address Input */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder={dictionary.auth.emailAddress}
                    placeholderTextColor="#9ca3af"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder={dictionary.auth.password}
                    placeholderTextColor="#9ca3af"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      errors.confirmPassword && styles.inputError,
                    ]}
                    placeholder={dictionary.auth.confirmPassword}
                    placeholderTextColor="#9ca3af"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Submit Action with AfricaSuk Brand Gradient */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.submitButtonWrapper,
                pressed && !isSubmitting && styles.buttonPressed,
                isSubmitting && styles.disabledButton,
              ]}
            >
              <LinearGradient
                colors={[BRAND_LIGHT, BRAND_DARK]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {dictionary.auth.createAccount}
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* Context Switching Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {dictionary.auth.alreadyHaveAccount}{" "}
            </Text>
            <Pressable onPress={() => router.push("/auth/login" as any)}>
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
    backgroundColor: "#f9fafb",
  },

  scrollContent: {
    flexGrow: 1,
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
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    color: TEXT_MUTED,
  },

  googleButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    backgroundColor: "#ffffff",

    alignItems: "center",
    justifyContent: "center",
  },

  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  googleButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },

  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },

  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER_COLOR,
  },

  separatorText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: "800",
    color: TEXT_MUTED,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  form: {
    gap: 12,
  },

  inputContainer: {
    gap: 4,
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

  inputError: {
    borderColor: DESTRUCTIVE,
  },

  errorText: {
    marginLeft: 2,
    fontSize: 11,
    fontWeight: "500",
    color: DESTRUCTIVE,
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
    alignItems: "center",
    justifyContent: "center",
  },

  submitButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 18,
  },

  footerText: {
    fontSize: 13,
    color: TEXT_MUTED,
  },

  loginLink: {
    fontSize: 13,
    fontWeight: "800",
    color: BRAND_LIGHT,
  },
});