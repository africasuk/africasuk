import type { Locale } from "../locales";

import {
  localeDirections,
} from "../locales";

export function getDirection(
  locale: Locale
): "ltr" | "rtl" {
  return (
    localeDirections[locale] ??
    "ltr"
  );
}