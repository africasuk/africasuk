import type { Href } from "expo-router";

export function getAuthRedirect(
  destination: string,
): Href {
  return `/auth?redirect=${encodeURIComponent(
    destination,
  )}` as Href;
}