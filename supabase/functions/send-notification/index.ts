
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const notificationSecret = Deno.env.get("NOTIFICATION_FUNCTION_SECRET");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

type NotificationRequest = {
  user_id: string;
  title: string;
  body: string;
  type: string;
  data?: Record<string, unknown>;
};

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (
    !notificationSecret ||
    req.headers.get("x-notification-secret") !== notificationSecret
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = (await req.json()) as NotificationRequest;

    const { user_id, title, body, type, data = {} } = payload;

    if (
      !user_id ||
      !title ||
      !body ||
      !type ||
      typeof user_id !== "string" ||
      typeof title !== "string" ||
      typeof body !== "string" ||
      typeof type !== "string" ||
      typeof data !== "object" ||
      data === null ||
      Array.isArray(data) ||
      title.length > 100 ||
      body.length > 1000 ||
      type.length > 50
    ) {
      return Response.json(
        { error: "Invalid notification payload." },
        { status: 400 },
      );
    }

    // Save notification in the customer's inbox.
    const { error: saveError } = await supabase
      .from("notifications")
      .insert({ user_id, title, body, type, data });

    if (saveError) {
      console.error("Database error:", saveError);
      return Response.json(
        { error: "Could not save notification." },
        { status: 500 },
      );
    }

    // Retrieve the customer's registered devices.
    const { data: devices, error: devicesError } = await supabase
      .from("push_tokens")
      .select("expo_push_token")
      .eq("user_id", user_id);

    if (devicesError) {
      console.error("Device lookup error:", devicesError);
      return Response.json(
        { success: true, saved: true, pushSent: 0 },
      );
    }

    if (!devices?.length) {
      return Response.json({
        success: true,
        saved: true,
        pushSent: 0,
        message: "No registered devices found.",
      });
    }

    // Expo accepts batches of up to 100 messages.
    const messages = devices.map((device) => ({
      to: device.expo_push_token,
      sound: "default",
      channelId: "default",
      priority: "high",
      title,
      body,
      data: { ...data, notificationType: type },
    }));

    let successful = 0;
    let failed = 0;

    for (let i = 0; i < messages.length; i += 100) {
      const batch = messages.slice(i, i + 100);

      const response = await fetch(
        "https://exp.host/--/api/v2/push/send",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batch),
        },
      );

      if (!response.ok) {
        failed += batch.length;
        console.error("Expo request failed:", await response.text());
        continue;
      }

      const result = await response.json();
      const tickets = Array.isArray(result.data) ? result.data : [];

      successful += tickets.filter(
        (ticket: { status?: string }) => ticket.status === "ok",
      ).length;

      failed += batch.length - tickets.length +
        tickets.filter(
          (ticket: { status?: string }) => ticket.status !== "ok",
        ).length;
    }

    return Response.json({
      success: true,
      saved: true,
      pushSent: successful,
      failed,
      totalDevices: devices.length,
    });
  } catch (error) {
    console.error("Notification error:", error);

    return Response.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
});
