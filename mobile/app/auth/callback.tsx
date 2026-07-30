import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { createClient } from "@/lib/auth/client";

const supabase = createClient();

export default function AuthCallbackScreen() {
  const { code, redirect } = useLocalSearchParams<{
    code?: string;
    redirect?: string;
  }>();

  useEffect(() => {
    async function handleCallback() {
      if (!code) {
        router.replace("/auth/login");
        return;
      }

      const { error } =
        await supabase.auth.exchangeCodeForSession(
          code
        );

      if (error) {
        console.error(error);
        router.replace("/auth/login");
        return;
      }

    router.replace(
      (typeof redirect === "string"
        ? redirect
        : "/") as any
    );
    }

    handleCallback();
  }, [code, redirect]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}