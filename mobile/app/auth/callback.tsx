import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import * as Linking from "expo-linking";

import { createClient } from "@/lib/auth/client";

export default function AuthCallbackScreen() {
  useEffect(() => {
    async function handle() {
      const supabase = createClient();

      const url = await Linking.getInitialURL();

      if (!url) {
        router.replace("/auth/login");
        return;
      }

      const { error } =
        await supabase.auth.exchangeCodeForSession(url);

      if (error) {
        console.error(error);
        router.replace("/auth/login");
        return;
      }

      router.replace("/");
    }

    handle();
  }, []);

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