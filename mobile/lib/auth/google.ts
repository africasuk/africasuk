import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { createClient } from "@/lib/auth/client";

WebBrowser.maybeCompleteAuthSession();

const supabase = createClient();

export async function signInWithGoogle() {
  const redirectTo = Linking.createURL("/auth/callback", {
    scheme: "africasuk",
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data?.url) {
    return { data, error };
  }

  const result = await WebBrowser.openAuthSessionAsync(
    data.url,
    redirectTo
  );

  if (result.type !== "success") {
    return {
      data: null,
      error: new Error("Google sign in cancelled."),
    };
  }

  return {
    data,
    error: null,
  };
}