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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { createClient } from "@/lib/auth/client";
import {
  loginSchema,
  type LoginFormData,
} from "@africasuk/validation";
import Logo from "@/components/layout/header/Logo";

// Ensure WebBrowser closes properly on redirect completion
WebBrowser.maybeCompleteAuthSession();

const BRAND_LIGHT = "#008744";
const BRAND_DARK = "#002b15";

interface LoginFormProps {
  onSuccess?: () => void | Promise<void>;
}

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

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const redirectTo = redirect ?? "/";

  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const supabase = createClient();
      const redirectUrl = Linking.createURL("/auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error(error);
        Alert.alert("Google Login Error", error.message);
        return;
      }

      if (!data?.url) {
        Alert.alert("Error", "No OAuth URL returned.");
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl
      );

      if (result.type !== "success") {
        return;
      }

      const parsed = Linking.parse(result.url);
      const code = parsed.queryParams?.code;

      if (!code) {
        Alert.alert("Error", "Authorization code not found.");
        return;
      }

      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(String(code));

      if (exchangeError) {
        console.error(exchangeError);
        Alert.alert("Authentication Failed", exchangeError.message);
        return;
      }

      if (onSuccess) {
        await onSuccess();
      } else {
        router.replace(redirectTo as Href);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      Alert.alert("Error", "Unable to start Google Sign-In.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand Logo & Compact Header */}
      <View style={styles.header}>
        <View style={styles.logoWrapper}>
          <Logo />
        </View>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue.</Text>
      </View>

      {/* Google OAuth Action Button */}
      <Pressable
        style={({ pressed }) => [
          styles.googleButton,
          pressed && styles.buttonPressed,
          googleLoading && styles.disabled,
        ]}
        disabled={googleLoading}
        onPress={handleGoogleLogin}
      >
        {googleLoading ? (
          <ActivityIndicator color="#374151" size="small" />
        ) : (
          <View style={styles.googleButtonContent}>
            <GoogleLogo size={18} />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </View>
        )}
      </Pressable>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email & Password Form */}
      <View style={styles.formGroup}>
        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email Address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        {/* Forgot Password Link */}
        <View style={styles.forgotContainer}>
          <Pressable
            onPress={() => router.push("/auth/forgot-password" as Href)}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Submit Button with AfricaSuk Gradient */}
        <Pressable
          style={({ pressed }) => [
            styles.submitButtonWrapper,
            pressed && !isSubmitting && styles.buttonPressed,
            isSubmitting && styles.disabled,
          ]}
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
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
              <Text style={styles.submitButtonText}>Sign In</Text>
            )}
          </LinearGradient>
        </Pressable>
      </View>

      {/* Footer Nav to Signup */}
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Don&apos;t have an account? </Text>
        <Pressable onPress={() => router.push("/auth/signup" as Href)}>
          <Text style={styles.signUpText}>Create Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

type Styles = {
  container: ViewStyle;
  header: ViewStyle;
  logoWrapper: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  googleButton: ViewStyle;
  googleButtonContent: ViewStyle;
  googleButtonText: TextStyle;
  dividerRow: ViewStyle;
  dividerLine: ViewStyle;
  dividerText: TextStyle;
  formGroup: ViewStyle;
  inputContainer: ViewStyle;
  input: TextStyle;
  inputError: TextStyle;
  errorText: TextStyle;
  forgotContainer: ViewStyle;
  forgotText: TextStyle;
  submitButtonWrapper: ViewStyle;
  submitButton: ViewStyle;
  submitButtonText: TextStyle;
  buttonPressed: ViewStyle;
  disabled: ViewStyle;
  footerRow: ViewStyle;
  footerText: TextStyle;
  signUpText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(229, 231, 235, 0.8)",
  },
  header: {
    marginBottom: 16,
    alignItems: "flex-start",
  },
  logoWrapper: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: BRAND_DARK,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  googleButton: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9ca3af",
  },
  formGroup: {
    gap: 12,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    fontSize: 13,
    color: "#111827",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    marginTop: 3,
    fontSize: 11,
    color: "#ef4444",
    fontWeight: "500",
  },
  forgotContainer: {
    alignItems: "flex-end",
  },
  forgotText: {
    fontSize: 12,
    fontWeight: "700",
    color: BRAND_LIGHT,
  },
  submitButtonWrapper: {
    marginTop: 4,
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
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 13,
    color: "#6b7280",
  },
  signUpText: {
    fontSize: 13,
    fontWeight: "800",
    color: BRAND_LIGHT,
  },
});