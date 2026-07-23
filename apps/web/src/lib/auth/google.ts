import { createClient } from "./client";

export async function signInWithGoogle(
  redirectTo = "/"
) {
  const supabase = createClient();

  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${
          window.location.origin
        }/auth/callback?redirect=${encodeURIComponent(
          redirectTo
        )}`,
      },
    });

  return {
    data,
    error,
  };
}