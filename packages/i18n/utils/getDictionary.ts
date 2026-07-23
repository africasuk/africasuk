import type { Dictionary } from "../types";
import type { Locale } from "../locales";

import en from "../dictionaries/en";
import ar from "../dictionaries/ar";

const dictionaries: Record<
  Locale,
  Dictionary
> = {
  en,
  ar,
};

export function getDictionary(
  locale: Locale
): Dictionary {
  return (
    dictionaries[locale] ??
    dictionaries.en
  );
}