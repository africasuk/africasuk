import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { getDictionary } from "@africasuk/i18n";

import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { CurrencyProvider } from "@/providers/CurrencyProvider";
import { ExchangeRateProvider } from "@/providers/ExchangeRateProvider";

const dictionary = getDictionary("en");

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider
          locale="en"
          dictionary={dictionary}
        >
          <CurrencyProvider initialCurrency="USD">
            <ExchangeRateProvider initialRate={1}>
              <Stack screenOptions={{ headerShown: false }} />
            </ExchangeRateProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}