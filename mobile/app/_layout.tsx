
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";

import { ExchangeRateProvider } from "@/providers/ExchangeRateProvider";
import { CurrencyProvider } from "@/providers/CurrencyProvider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

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
    continueWithGoogle: "Continue with Google",
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

  useEffect(() => {
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn("Could not hide native splash:", error);
      }
    };

    hideNativeSplash();
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
                {/* AfricaSuk startup splash */}
                <Stack.Screen
                  name="splash"
                  options={{
                    headerShown: false,
                    animation: "none",
                  }}
                />

                {/* Main application */}
                <Stack.Screen
                  name="(tabs)"
                  options={{
                    headerShown: false,
                  }}
                />

                {/* Modal */}
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
