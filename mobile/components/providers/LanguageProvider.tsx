import React, { createContext, useContext, useState, useEffect } from "react";
import type { Dictionary, Locale } from "@africasuk/i18n";

interface LanguageContextValue {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface Props {
  initialLocale: Locale;
  initialDictionary: Dictionary;
  // Optional dictionary fetcher/loader for dynamic switching on mobile
  loadDictionary?: (locale: Locale) => Promise<Dictionary>;
  children: React.ReactNode;
}

export function LanguageProvider({
  initialLocale,
  initialDictionary,
  loadDictionary,
  children,
}: Props) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [dictionary, setDictionary] = useState<Dictionary>(initialDictionary);

  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    setLocaleState(newLocale);

    if (loadDictionary) {
      try {
        const newDict = await loadDictionary(newLocale);
        setDictionary(newDict);
      } catch (error) {
        console.error(`Failed to load dictionary for locale: ${newLocale}`, error);
      }
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        dictionary,
        setLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useTranslation must be used inside a LanguageProvider"
    );
  }

  return context;
}