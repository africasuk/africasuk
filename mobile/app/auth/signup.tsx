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

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter, type Href } from "expo-router";

import {
  ArrowRight,
  Eye,
  EyeOff,
  Home,
} from "lucide-react-native";

import { useTranslation } from "@/components/providers/LanguageProvider";

import {
  signupSchema,
  type SignupFormData,
} from "@/lib/validation/signup";

import { signUp } from "@/lib/auth/signup";

const DARK_GREEN = "#005c2e";
const YELLOW = "#000000";

export default function SignupPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dictionary } = useTranslation();

  const scrollRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios"
        ? "keyboardWillShow"
        : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios"
        ? "keyboardWillHide"
        : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () =>
      setKeyboardVisible(true),
    );

    const hideSub = Keyboard.addListener(hideEvent, () =>
      setKeyboardVisible(false),
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
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const sendSignupEmail = async (
    email: string,
    name: string,
  ) => {
    try {
      const controller = new AbortController();

      const timeoutId = setTimeout(
        () => controller.abort(),
        6000,
      );

      await fetch(
        "https://www.africasuk.com/api/email/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            name: name.trim(),
          }),
        },
      );

      clearTimeout(timeoutId);
    } catch (emailError) {
      console.warn(
        "Non-critical signup email error:",
        emailError,
      );
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { error } = await signUp({
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (error) {
        Alert.alert(
          "Registration Failed",
          error.message,
        );
        return;
      }

      void sendSignupEmail(
        data.email,
        data.fullName,
      );

      Alert.alert(
        "Success",
        dictionary.auth?.welcomeToAfricaSuk ??
          "Welcome to Africa Suk!",
        [
          {
            text: "Continue",
            onPress: () => {
              reset();
              router.replace("/(tabs)" as Href);
            },
          },
        ],
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred.";

      Alert.alert("Error", message);
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

        {/* Brand Header */}
        {!isKeyboardVisible && (
          <View style={styles.brandArea}>
            <Text style={styles.brandText}>
              Welcome to Africa Suk
            </Text>

            <Text style={styles.tagline}>
              CREATE AN ACCOUNT TO START ORDERING
            </Text>
          </View>
        )}
      </ImageBackground>

      {/* Form Area */}
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
         

            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {dictionary.auth?.fullName ??
                    "Full Name"}
                </Text>

                <Controller
                  control={control}
                  name="fullName"
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
                        errors.fullName &&
                          styles.inputError,
                      ]}
                      placeholder="Enter your full name"
                      placeholderTextColor="#a1a1aa"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="words"
                      autoComplete="name"
                      textContentType="name"
                      returnKeyType="next"
                      onSubmitEditing={() =>
                        emailInputRef.current?.focus()
                      }
                      editable={!isSubmitting}
                    />
                  )}
                />

                {errors.fullName && (
                  <Text style={styles.errorText}>
                    {errors.fullName.message}
                  </Text>
                )}
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {dictionary.auth?.emailAddress ??
                    "Email"}
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
                      ref={emailInputRef}
                      style={[
                        styles.input,
                        errors.email &&
                          styles.inputError,
                      ]}
                      placeholder="Enter your email"
                      placeholderTextColor="#a1a1aa"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      textContentType="emailAddress"
                      returnKeyType="next"
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
                <Text style={styles.label}>
                  {dictionary.auth?.password ??
                    "Password"}
                </Text>

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
                        placeholder="Create a strong password"
                        placeholderTextColor="#a1a1aa"
                        secureTextEntry={
                          !showPassword
                        }
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="password-new"
                        textContentType="newPassword"
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          confirmPasswordInputRef.current?.focus()
                        }
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
                        style={styles.eyeButton}
                        onPress={() =>
                          setShowPassword(
                            (prev) => !prev,
                          )
                        }
                        hitSlop={8}
                        disabled={isSubmitting}
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
                    {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {dictionary.auth?.confirmPassword ??
                    "Confirm Password"}
                </Text>

                <Controller
                  control={control}
                  name="confirmPassword"
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
                        ref={
                          confirmPasswordInputRef
                        }
                        style={[
                          styles.input,
                          styles.passwordInput,
                          errors.confirmPassword &&
                            styles.inputError,
                        ]}
                        placeholder="Re-enter your password"
                        placeholderTextColor="#a1a1aa"
                        secureTextEntry={
                          !showConfirmPassword
                        }
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="password-new"
                        textContentType="newPassword"
                        returnKeyType="done"
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
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        style={styles.eyeButton}
                        onPress={() =>
                          setShowConfirmPassword(
                            (prev) => !prev,
                          )
                        }
                        hitSlop={8}
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? (
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

                {errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {
                      errors.confirmPassword
                        .message
                    }
                  </Text>
                )}
              </View>

              {/* Submit */}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled: isSubmitting,
                }}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed &&
                    !isSubmitting &&
                    styles.buttonPressed,
                  isSubmitting &&
                    styles.disabled,
                ]}
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}
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
                        styles.submitButtonText
                      }
                    >
                      {dictionary.auth
                        ?.createAccount ??
                        "Create Account"}
                    </Text>

                    <ArrowRight
                      size={16}
                      color="#ffffff"
                      strokeWidth={2}
                    />
                  </>
                )}
              </Pressable>
            </View>

            {/* Back to Login */}
            <View style={styles.loginRow}>
              <Text style={styles.loginRowText}>
                {dictionary.auth
                  ?.alreadyHaveAccount ??
                  "Already have an account?"}
              </Text>

              <Pressable
                accessibilityRole="link"
                accessibilityLabel="Go to Login"
                onPress={() =>
                  router.push(
                    "/auth/login" as Href,
                  )
                }
                hitSlop={6}
              >
                <Text style={styles.loginLink}>
                  {dictionary.auth?.login ??
                    "Sign In"}
                </Text>
              </Pressable>
            </View>

            {/* Bottom Logo + Home */}
            <View style={styles.bottomSection}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("@/assets/images/logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View
                style={styles.homeButtonContainer}
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
                    style={styles.homeButtonText}
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
    height: 325,
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
    backgroundColor: "rgba(0,92,46,0.55)",
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
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 4,
  },

  tagline: {
    marginTop: 5,
    color: "#FFC000",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 2,
  },

  formArea: {
    flex: 1,
    zIndex: 10,
    elevation: 10,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 335,
  },

  formContent: {
    width: "91%",
    alignSelf: "center",
  },

  heading: {
    alignItems: "center",
    marginBottom: 23,
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
    marginTop: 7,
    maxWidth: 280,
    color: "#71717a",
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "400",
    textAlign: "center",
  },

  form: {
    gap: 16,
  },

  inputGroup: {
    gap: 7,
  },

  label: {
    color: "#27272a",
    fontSize: 11,
    fontWeight: "700",
  },

  input: {
    width: "100%",
    height: 50,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: DARK_GREEN,
    paddingHorizontal: 15,
    color: "#111111",
    fontSize: 13,
  },

  inputError: {
    borderColor: "#ef4444",
  },

  errorText: {
    color: "#dc2626",
    fontSize: 10,
    marginTop: -2,
  },

  passwordWrapper: {
    position: "relative",
  },

  passwordInput: {
    paddingRight: 48,
  },

  eyeButton: {
    position: "absolute",
    right: 9,
    top: 5,
    width: 38,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  submitButton: {
    height: 50,
    marginTop: 3,
    borderRadius: 25,
    backgroundColor: DARK_GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    shadowColor: DARK_GREEN,
    shadowOpacity: 0.18,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
  },

  submitButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
  },

  loginRow: {
    marginTop: 21,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  loginRowText: {
    color: "#71717a",
    fontSize: 10,
  },

  loginLink: {
    color: YELLOW,
    fontSize: 10,
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
    opacity: 0.55,
  },
});