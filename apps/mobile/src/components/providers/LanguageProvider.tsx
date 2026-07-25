import {
  createContext,
  useContext,
} from "react";

import type {
  Dictionary,
  Locale,
} from "@africasuk/i18n";

interface LanguageContextValue {
  locale: Locale;
  dictionary: Dictionary;
}

const LanguageContext =
  createContext<LanguageContextValue | null>(
    null
  );

interface Props {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}

export function LanguageProvider({
  locale,
  dictionary,
  children,
}: Props) {
  return (
    <LanguageContext.Provider
      value={{
        locale,
        dictionary,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useTranslation must be used inside LanguageProvider"
    );
  }

  return context;
}