import * as Linking from "expo-linking";
import { createClient } from "./client";

export async function forgotPassword(email: string) {
  const supabase = createClient();

  const redirectTo = Linking.createURL("/auth/reset-password");

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  return {
    data,
    error,
  };
}