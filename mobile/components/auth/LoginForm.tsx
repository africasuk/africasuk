import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useLocalSearchParams,
  useRouter,
  type Href,
} from "expo-router";

import * as Linking from "expo-linking";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Home,
} from "lucide-react-native";

import {
  Controller,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { createClient } from "@/lib/auth/client";
import {
  loginSchema,
  type LoginFormData,
} from "@/lib/validation/login";

const DARK_GREEN = "#005c2e";
const YELLOW = "#000000";

interface LoginFormProps {
  onSuccess?: () => void | Promise<void>;
}

export default function LoginForm({
  onSuccess,
}: LoginFormProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);
  const passwordInputRef =
    useRef<TextInput>(null);

  const [showPassword, setShowPassword] =
    useState(false);

  const [isKeyboardVisible, setKeyboardVisible] =
    useState(false);

  /**
   * IMPORTANT:
   * Preserve the exact page the user was
   * originally trying to reach.
   */
  const params = useLocalSearchParams<{
    redirect?: string | string[];
  }>();

  const redirectTo =
    typeof params.redirect === "string" &&
    params.redirect.length > 0
      ? params.redirect
      : "/(tabs)";

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios"
        ? "keyboardWillShow"
        : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios"
        ? "keyboardWillHide"
        : "keyboardDidHide";

    const showSub = Keyboard.addListener(
      showEvent,
      () => setKeyboardVisible(true),
    );

    const hideSub = Keyboard.addListener(
      hideEvent,
      () => setKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const sendLoginEmail = async (
    email: string,
    name?: string | null,
  ) => {
    try {
      const controller =
        new AbortController();

      const timeoutId = setTimeout(
        () => controller.abort(),
        6000,
      );

      await fetch(
        "https://www.africasuk.com/api/email/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            email: email
              .trim()
              .toLowerCase(),

            name:
              name ||
              email.split("@")[0],
          }),
        },
      );

      clearTimeout(timeoutId);
    } catch (error) {
      console.warn(
        "Non-critical login notification error:",
        error,
      );
    }
  };

  const handleLoginSuccess = async (
    supabase: ReturnType<typeof createClient>,
    fallbackEmail?: string,
  ) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const userEmail =
        user?.email ?? fallbackEmail;

      if (userEmail) {
        void sendLoginEmail(
          userEmail,
          user?.user_metadata
            ?.full_name ??
            user?.user_metadata
              ?.name ??
            null,
        );
      }

      /**
       * If a parent component supplied
       * onSuccess, let it handle the transition.
       *
       * Otherwise return to the exact
       * destination that brought the user
       * to login.
       */
      if (onSuccess) {
        await onSuccess();
      } else {
        router.replace(
          redirectTo as Href,
        );
      }
    } catch (error) {
      console.error(
        "Success transition error:",
        error,
      );

      router.replace(
        redirectTo as Href,
      );
    }
  };

  const onSubmit = async (
    data: LoginFormData,
  ) => {
    try {
      const supabase = createClient();

      const { error } =
        await supabase.auth.signInWithPassword(
          {
            email: data.email.trim(),
            password: data.password,
          },
        );

      if (error) {
        Alert.alert(
          "Login Failed",
          error.message,
        );
        return;
      }

      await handleLoginSuccess(
        supabase,
        data.email.trim(),
      );
    } catch (error) {
      console.error(
        "Login exception:",
        error,
      );

      Alert.alert(
        "Error",
        "An unexpected error occurred. Please check your connection and try again.",
      );
    }
  };

  return (
    <View style={styles.screen}>
      {/* Hero Header */}
      <ImageBackground
        source={require("@/assets/images/auth-bg-page.png")}
        style={styles.hero}
        resizeMode="cover"
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroOverlay} />

        {!isKeyboardVisible && (
          <View style={styles.brandArea}>
            <Text style={styles.brandText}>
              AFRICA SUK
            </Text>

            <Text style={styles.tagline}>
              SHOP WITH CONFIDENCE
            </Text>
          </View>
        )}
      </ImageBackground>

      {/* Form Content */}
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
        style={styles.formArea}
        keyboardVerticalOffset={
          Platform.OS === "ios" ? 10 : 0
        }
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(
                insets.bottom + 20,
                36,
              ),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContent}>
            {/* Title */}
            <View style={styles.heading}>
              <Text style={styles.title}>
                Welcome Back
              </Text>

              <Text style={styles.subtitle}>
                Sign in to continue shopping
                with confidence.
              </Text>
            </View>

            <View style={styles.form}>
              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Email
                </Text>

                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: {
                      onChange,
                      onBlur,
                      value,
                    },
                  }) => (
                    <TextInput
                      style={[
                        styles.input,
                        errors.email &&
                          styles.inputError,
                      ]}
                      placeholder="Enter your email"
                      placeholderTextColor="#a1a1aa"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      textContentType="emailAddress"
                      returnKeyType="next"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      onSubmitEditing={() =>
                        passwordInputRef.current?.focus()
                      }
                      editable={!isSubmitting}
                    />
                  )}
                />

                {errors.email && (
                  <Text style={styles.errorText}>
                    {errors.email.message}
                  </Text>
                )}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <View
                  style={styles.passwordHeader}
                >
                  <Text style={styles.label}>
                    Password
                  </Text>

                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel="Forgot Password"
                    onPress={() =>
                      Linking.openURL(
                        "https://www.africasuk.com/auth/forgot-password",
                      )
                    }
                    hitSlop={8}
                  >
                    <Text
                      style={styles.forgotText}
                    >
                      Forgot Password?
                    </Text>
                  </Pressable>
                </View>

                <Controller
                  control={control}
                  name="password"
                  render={({
                    field: {
                      onChange,
                      onBlur,
                      value,
                    },
                  }) => (
                    <View
                      style={
                        styles.passwordWrapper
                      }
                    >
                      <TextInput
                        ref={passwordInputRef}
                        style={[
                          styles.input,
                          styles.passwordInput,
                          errors.password &&
                            styles.inputError,
                        ]}
                        placeholder="Enter your password"
                        placeholderTextColor="#a1a1aa"
                        secureTextEntry={
                          !showPassword
                        }
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="password"
                        textContentType="password"
                        returnKeyType="done"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        onSubmitEditing={handleSubmit(
                          onSubmit,
                        )}
                        onFocus={() => {
                          setTimeout(() => {
                            scrollRef.current?.scrollToEnd(
                              {
                                animated: true,
                              },
                            );
                          }, 180);
                        }}
                        editable={!isSubmitting}
                      />

                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        style={
                          styles.eyeButton
                        }
                        onPress={() =>
                          setShowPassword(
                            (prev) => !prev,
                          )
                        }
                        hitSlop={10}
                      >
                        {showPassword ? (
                          <EyeOff
                            size={18}
                            color="#71717a"
                          />
                        ) : (
                          <Eye
                            size={18}
                            color="#71717a"
                          />
                        )}
                      </Pressable>
                    </View>
                  )}
                />

                {errors.password && (
                  <Text style={styles.errorText}>
                    {
                      errors.password
                        .message
                    }
                  </Text>
                )}
              </View>

              {/* Sign In */}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled: isSubmitting,
                }}
                style={({ pressed }) => [
                  styles.signInButton,
                  pressed &&
                    !isSubmitting &&
                    styles.buttonPressed,
                  isSubmitting &&
                    styles.disabled,
                ]}
                disabled={isSubmitting}
                onPress={handleSubmit(
                  onSubmit,
                )}
              >
                {isSubmitting ? (
                  <ActivityIndicator
                    color="#ffffff"
                    size="small"
                  />
                ) : (
                  <>
                    <Text
                      style={
                        styles.signInText
                      }
                    >
                      Sign In
                    </Text>

                    <ArrowRight
                      size={16}
                      color="#ffffff"
                      strokeWidth={2.4}
                    />
                  </>
                )}
              </Pressable>
            </View>

            {/* Create Account */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>
                Don&apos;t have an account?
              </Text>

              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Create Account"
                onPress={() =>
                  router.push(
                    `/auth/signup?redirect=${encodeURIComponent(
                      redirectTo,
                    )}` as Href,
                  )
                }
                hitSlop={8}
              >
                <Text
                  style={styles.signupLink}
                >
                  Create Account
                </Text>
              </Pressable>
            </View>

            {/* Bottom Logo + Home */}
            <View
              style={styles.bottomSection}
            >
              <View
                style={styles.logoContainer}
              >
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View
                style={
                  styles.homeButtonContainer
                }
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Back to Home"
                  style={({ pressed }) => [
                    styles.homeButton,
                    pressed &&
                      styles.buttonPressed,
                  ]}
                  onPress={() =>
                    router.replace(
                      "/(tabs)" as Href,
                    )
                  }
                >
                  <Home
                    size={17}
                    color="#ffffff"
                    strokeWidth={2.2}
                  />

                  <Text
                    style={
                      styles.homeButtonText
                    }
                  >
                    Back to Home
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f1f3f2",
  },

  hero: {
    position: "absolute",
    top: -30,
    left: 0,
    right: 0,
    height: 355,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  heroImage: {
    transform: [{ translateY: 22 }],
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor:
      "rgba(0,92,46,0.55)",
  },

  brandArea: {
    alignItems: "center",
    marginTop: 25,
  },

  brandText: {
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
    letterSpacing: 1.5,
    textShadowColor:
      "rgba(0,0,0,0.35)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 4,
  },

  tagline: {
    marginTop: 5,
    color: "#f5c542",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },

  formArea: {
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 335,
    paddingBottom: 35,
  },

  formContent: {
    width: "91%",
    maxWidth: 440,
    alignSelf: "center",
  },

  heading: {
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    color: "#111111",
    fontSize: 23,
    lineHeight: 28,
    fontWeight: "800",
    letterSpacing: -0.4,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 6,
    maxWidth: 280,
    color: "#71717a",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400",
    textAlign: "center",
  },

  form: {
    gap: 16,
  },

  inputGroup: {
    gap: 6,
  },

  label: {
    color: "#27272a",
    fontSize: 12,
    fontWeight: "700",
  },

  input: {
    width: "100%",
    height: 50,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: DARK_GREEN,
    paddingHorizontal: 15,
    color: "#111111",
    fontSize: 14,
  },

  inputError: {
    borderColor: "#ef4444",
  },

  errorText: {
    color: "#dc2626",
    fontSize: 11,
    marginTop: 2,
  },

  passwordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  forgotText: {
    color: YELLOW,
    fontSize: 11,
    fontWeight: "700",
  },

  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },

  passwordInput: {
    paddingRight: 48,
  },

  eyeButton: {
    position: "absolute",
    right: 6,
    width: 38,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  signInButton: {
    height: 50,
    marginTop: 4,
    borderRadius: 25,
    backgroundColor: DARK_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: DARK_GREEN,
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  signInText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },

  signupRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  signupText: {
    color: "#71717a",
    fontSize: 12,
  },

  signupLink: {
    color: YELLOW,
    fontSize: 12,
    fontWeight: "800",
  },

  bottomSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },

  logoContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 125,
    height: 55,
  },

  homeButtonContainer: {
    alignItems: "center",
    marginTop: 8,
  },

  homeButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: DARK_GREEN,
  },

  homeButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  disabled: {
    opacity: 0.6,
  },
});