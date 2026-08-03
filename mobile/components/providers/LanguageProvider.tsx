import React, { createContext, useContext, useState } from "react";

export type Locale = "en";

export interface Dictionary {
  common: {
    login: string;
    myAccount: string;
  };

  auth: {
    welcomeToAfricaSuk: string;
    signupTitle: string;
    signupSubtitle: string;
    continueWithGoogle: string;
    or: string;
    fullName: string;
    emailAddress: string;
    password: string;
    confirmPassword: string;
    createAccount: string;
    alreadyHaveAccount: string;
    login: string;
  };
}

interface LanguageContextValue {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface Props {
  initialLocale: Locale;
  initialDictionary: Dictionary;
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
  const [dictionary, setDictionary] =
    useState<Dictionary>(initialDictionary);

  const setLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    setLocaleState(newLocale);

    if (loadDictionary) {
      try {
        const newDictionary = await loadDictionary(newLocale);
        setDictionary(newDictionary);
      } catch (error) {
        console.error("Failed to load dictionary:", error);
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