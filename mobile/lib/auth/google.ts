import * as WebBrowser from "expo-web-browser";

import { createClient } from "@/lib/auth/client";

const supabase = createClient();

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {
  const callbackUrl = "mobile://auth/callback";

  console.log("Callback URL:", callbackUrl);

  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
        skipBrowserRedirect: true,
      },
    });

  console.log("OAuth URL:", data?.url);

  if (error || !data?.url) {
    console.error(error);
    return { data, error };
  }

  const result = await WebBrowser.openAuthSessionAsync(
    data.url,
    callbackUrl
  );

  console.log("Browser Result:", result);

  return {
    data,
    error: null,
  };
}