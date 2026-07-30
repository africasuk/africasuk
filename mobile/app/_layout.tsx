import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";

import { ExchangeRateProvider } from "@/providers/ExchangeRateProvider";
import { CurrencyProvider } from "@/providers/CurrencyProvider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

import {
  getDictionary,
  type Locale,
} from "@africasuk/i18n";


export default function RootLayout() {
  const colorScheme = useColorScheme();

  const defaultLocale: Locale = "en";
  const initialDictionary = getDictionary(defaultLocale);

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
        loadDictionary={async (locale: Locale) =>
          getDictionary(locale)
        }
      >
        <ExchangeRateProvider>
          <CurrencyProvider>
            <ThemeProvider
              value={
                colorScheme === "dark"
                  ? DarkTheme
                  : DefaultTheme
              }
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
                  name="(tabs)"
                  options={{ headerShown: false }}
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