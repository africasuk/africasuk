import { useEffect } from "react";
import { router } from "expo-router";
import { createClient } from "@/lib/auth/client";

export default function LogoutScreen() {
  useEffect(() => {
    async function logout() {
      const supabase = createClient();

      await supabase.auth.signOut();

      router.replace("/");
    }

    logout();
  }, []);

  return null;
}