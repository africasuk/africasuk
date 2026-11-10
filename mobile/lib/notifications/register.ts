
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { supabase } from "@/lib/supabase/client";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications(userId: string) {
  try {
    // Expo Go does not support remote push-token registration.
    if (
      Constants.appOwnership === "expo" ||
      Constants.executionEnvironment === "storeClient"
    ) {
      console.log(
        "Push token registration requires an EAS development or production build."
      );
      return null;
    }

    // Remote push notifications require a physical device.
    if (!Constants.isDevice) {
      console.log("Push notifications require a physical device.");
      return null;
    }

    if (Platform.OS !== "android" && Platform.OS !== "ios") {
      return null;
    }

    // Configure Android notification channel before requesting permission.
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Africa Suk Notifications",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#16833B",
      });
    }

    // Check notification permission.
    const permission = await Notifications.getPermissionsAsync();
    let status = permission.status;

    if (status !== "granted") {
      const requested =
        await Notifications.requestPermissionsAsync();

      status = requested.status;
    }

    if (status !== "granted") {
      console.log("Notification permission not granted.");
      return null;
    }

    // Get EAS project ID.
    const projectId =
      Constants.easConfig?.projectId ??
      Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      throw new Error("Expo EAS project ID is missing.");
    }

    // Generate Expo push token.
    const tokenResponse =
      await Notifications.getExpoPushTokenAsync({
        projectId,
      });

    const expoPushToken = tokenResponse.data;

    if (!expoPushToken) {
      throw new Error("Expo push token could not be generated.");
    }

    // Save or update the device token in Supabase.
    const { error } = await supabase
      .from("push_tokens")
      .upsert(
        {
          user_id: userId,
          expo_push_token: expoPushToken,
          platform: Platform.OS,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "expo_push_token",
        }
      );

    if (error) {
      throw error;
    }

    console.log("Africa Suk push token registered successfully.");

    return expoPushToken;
  } catch (error) {
    console.error(
      "Push notification registration failed:",
      error
    );

    return null;
  }
}
