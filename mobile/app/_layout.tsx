
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";

import { ExchangeRateProvider } from "@/providers/ExchangeRateProvider";
import { CurrencyProvider } from "@/providers/CurrencyProvider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

import { supabase } from "@/lib/supabase/client";

export const unstable_settings = {
  initialRouteName: "splash",
};

SplashScreen.preventAutoHideAsync();

type Locale = "en";

const defaultLocale: Locale = "en";

const initialDictionary = {
  common: {
    login: "Login",
    myAccount: "My Account",
  },
  auth: {
    welcomeToAfricaSuk: "Welcome to AfricaSuk!",
    signupTitle: "Create Account",
    signupSubtitle: "Create your AfricaSuk account",
    or: "OR",
    fullName: "Full Name",
    emailAddress: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    login: "Login",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [userId, setUserId] = useState<string | null>(null);

  // Keep track of the authenticated customer.
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to load auth session:", error);
        return;
      }

      if (mounted) {
        setUserId(data.session?.user?.id ?? null);
      }
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUserId(session?.user?.id ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Register push notifications only outside Expo Go.
  useEffect(() => {
    if (!userId) return;

    if (Constants.appOwnership === "expo") {
      return;
    }

    let cancelled = false;

    const register = async () => {
      try {
        const { registerForPushNotifications } = await import(
          "@/lib/notifications/register"
        );

        if (!cancelled) {
          await registerForPushNotifications(userId);
        }
      } catch (error) {
        console.error("Push notification registration failed:", error);
      }
    };

    void register();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Hide the native splash screen.
  useEffect(() => {
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn("Could not hide native splash:", error);
      }
    };

    void hideNativeSplash();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      <LanguageProvider
        initialLocale={defaultLocale}
        initialDictionary={initialDictionary}
        loadDictionary={async () => initialDictionary}
      >
        <ExchangeRateProvider>
          <CurrencyProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: {
                    backgroundColor: "#FFFFFF",
                  },
                }}
              >
                <Stack.Screen
                  name="splash"
                  options={{
                    headerShown: false,
                    animation: "none",
                  }}
                />

                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: "modal",
                    title: "Modal",
                  }}
                />
              </Stack>

              <StatusBar
                style="dark"
                backgroundColor="#FFFFFF"
              />
            </ThemeProvider>
          </CurrencyProvider>
        </ExchangeRateProvider>
      </LanguageProvider>
    </View>
  );
}
