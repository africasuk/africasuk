"use server";

import { revalidatePath } from "next/cache";

import { ProductRepository } from "@africasuk/database";
import { ProductQueryService } from "@africasuk/api";
import type { ProductWithDetails } from "@africasuk/types";

import { Roles } from "@/lib/auth/roles";
import { Permissions, hasPermission } from "@/lib/auth/permissions";
import { requireWorkspace } from "@/lib/auth/workspace";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const ALLOWED_ROLES = [Roles.SUPER_ADMIN, Roles.ADMIN];

type CampaignType =
  | "PRODUCT_PROMOTION"
  | "ANNOUNCEMENT"
  | "SPECIAL_GREETING"
  | "CUSTOM";

interface CampaignInput {
  title: string;
  body: string;
  campaignType: CampaignType;
  productId?: string | null;
  imageUrl?: string | null;
  targetUrl?: string | null;
  scheduledAt?: string | null;
}

interface PushToken {
  user_id: string;
  expo_push_token: string;
}

interface ExpoTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: {
    error?: string;
  };
}

async function authorize(
  permission: (typeof Permissions)[keyof typeof Permissions]
) {
  const { user, profile } = await requireWorkspace(ALLOWED_ROLES);

  const allowed = hasPermission(
    profile.role as Parameters<typeof hasPermission>[0],
    permission
  );

  if (!allowed) {
    throw new Error("You do not have permission to perform this action.");
  }

  return user;
}

// --------------------------------------------------
// PRODUCTS
// --------------------------------------------------

export async function getNotificationProducts() {
  await authorize(Permissions.NOTIFICATIONS_VIEW);

  const db = createAdminSupabaseClient();

  const service = new ProductQueryService(
    new ProductRepository(db)
  );

  const products = (await service.getAll()) as ProductWithDetails[];

  return products
    .filter((product) => product.isActive)
    .map((product) => {
      const imageUrl =
        product.colors
          .flatMap((color) => color.images)
          .find((image) => image.imageUrl)?.imageUrl ?? null;

      const prices = product.colors
        .flatMap((color) => color.variants)
        .filter((variant) => variant.isActive)
        .map((variant) => variant.price);

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl,
        price: prices.length ? Math.min(...prices) : null,
        url: `https://africasuk.com/products/${encodeURIComponent(product.slug)}`,
      };
    });
}

// --------------------------------------------------
// OVERVIEW
// --------------------------------------------------

export async function getNotificationOverview() {
  await authorize(Permissions.NOTIFICATIONS_VIEW);

  const db = createAdminSupabaseClient();

  const [
    notifications,
    devices,
    campaigns,
    preferences,
  ] = await Promise.all([
    db.from("notifications").select("id", { count: "exact", head: true }),
    db.from("push_tokens").select("id", { count: "exact", head: true }),
    db
      .from("notification_campaigns")
      .select("id", { count: "exact", head: true })
      .eq("status", "SENT"),
    db
      .from("notification_preferences")
      .select("user_id", { count: "exact", head: true })
      .eq("marketing_enabled", true),
  ]);

  const error =
    notifications.error ??
    devices.error ??
    campaigns.error ??
    preferences.error;

  if (error) throw new Error(error.message);

  return {
    totalNotifications: notifications.count ?? 0,
    registeredDevices: devices.count ?? 0,
    campaignsSent: campaigns.count ?? 0,
    eligibleCustomers: preferences.count ?? 0,
  };
}

// --------------------------------------------------
// CAMPAIGN HISTORY
// --------------------------------------------------

export async function getNotificationCampaigns() {
  await authorize(Permissions.NOTIFICATIONS_VIEW);

  const db = createAdminSupabaseClient();

  const { data, error } = await db
    .from("notification_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);

  return data ?? [];
}

// --------------------------------------------------
// CREATE CAMPAIGN DRAFT
// --------------------------------------------------

export async function createNotificationCampaign(input: CampaignInput) {
  const user = await authorize(Permissions.NOTIFICATIONS_SEND);

  const title = input.title.trim();
  const body = input.body.trim();

  if (!title || !body) {
    throw new Error("Notification title and message are required.");
  }

  if (title.length > 120 || body.length > 500) {
    throw new Error("Notification title or message is too long.");
  }

  const allowedTypes: CampaignType[] = [
    "PRODUCT_PROMOTION",
    "ANNOUNCEMENT",
    "SPECIAL_GREETING",
    "CUSTOM",
  ];

  if (!allowedTypes.includes(input.campaignType)) {
    throw new Error("Invalid campaign type.");
  }

  const db = createAdminSupabaseClient();

  let productId: string | null = null;
  let imageUrl = input.imageUrl?.trim() || null;
  let targetUrl = input.targetUrl?.trim() || null;

  if (input.campaignType === "PRODUCT_PROMOTION") {
    if (!input.productId) {
      throw new Error("Please select a product.");
    }

    const service = new ProductQueryService(
      new ProductRepository(db)
    );

    const products = (await service.getAll()) as ProductWithDetails[];

    const product = products.find(
      (item) => item.id === input.productId && item.isActive
    );

    if (!product) {
      throw new Error("Product not found or inactive.");
    }

    productId = product.id;

    imageUrl =
      product.colors
        .flatMap((color) => color.images)
        .find((image) => image.imageUrl)?.imageUrl ?? null;

    targetUrl = `https://africasuk.com/products/${encodeURIComponent(product.slug)}`;
  } else {
    for (const url of [imageUrl, targetUrl]) {
      if (!url) continue;

      let parsed: URL;

      try {
        parsed = new URL(url);
      } catch {
        throw new Error("Please provide a valid URL.");
      }

      if (!["https:", "http:"].includes(parsed.protocol)) {
        throw new Error("Only HTTP and HTTPS links are allowed.");
      }
    }
  }

  if (input.scheduledAt) {
    throw new Error("Scheduled sending is not available yet.");
  }

  const { data, error } = await db
    .from("notification_campaigns")
    .insert({
      title,
      body,
      campaign_type: input.campaignType,
      product_id: productId,
      image_url: imageUrl,
      target_url: targetUrl,
      status: "DRAFT",
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/notifications");

  return {
    success: true,
    campaignId: data.id as string,
  };
}

// --------------------------------------------------
// SEND CAMPAIGN
// --------------------------------------------------

export async function sendNotificationCampaign(campaignId: string) {
  await authorize(Permissions.NOTIFICATIONS_SEND);

  if (!campaignId?.trim()) {
    throw new Error("Campaign ID is required.");
  }

  const db = createAdminSupabaseClient();

  const { data: campaign, error: campaignError } = await db
    .from("notification_campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (campaignError || !campaign) {
    throw new Error("Campaign not found.");
  }

  if (campaign.status !== "DRAFT") {
    throw new Error("Only draft campaigns can be sent.");
  }

  // Prevent duplicate campaign sending.
  const { data: claimed, error: claimError } = await db
    .from("notification_campaigns")
    .update({ status: "SENDING" })
    .eq("id", campaignId)
    .eq("status", "DRAFT")
    .select("id")
    .maybeSingle();

  if (claimError) throw new Error(claimError.message);

  if (!claimed) {
    throw new Error("This campaign is already being processed.");
  }

  try {
    // 1. Get customers who enabled marketing notifications.
    const { data: preferences, error: preferenceError } = await db
      .from("notification_preferences")
      .select("user_id")
      .eq("marketing_enabled", true);

    if (preferenceError) {
      throw new Error(preferenceError.message);
    }

    const optedInUsers = Array.from(
      new Set(
        (preferences ?? []).map(
          (item: { user_id: string }) => item.user_id
        )
      )
    );

    if (optedInUsers.length === 0) {
      throw new Error("No customers have opted in to marketing.");
    }

    // 2. Save inbox notifications for ALL opted-in customers.
    const { error: inboxError } = await db
      .from("notifications")
      .insert(
        optedInUsers.map((userId) => ({
          user_id: userId,
          title: campaign.title,
          body: campaign.body,
          type: "CAMPAIGN",
          data: {
            campaignId,
            url: campaign.target_url,
            imageUrl: campaign.image_url,
          },
        }))
      );

    if (inboxError) {
      throw new Error(inboxError.message);
    }

    // 3. Create delivery records for all opted-in customers.
    const sentAt = new Date().toISOString();

    const { error: deliveryError } = await db
      .from("notification_campaign_deliveries")
      .insert(
        optedInUsers.map((userId) => ({
          campaign_id: campaignId,
          user_id: userId,
          status: "SENT",
          sent_at: sentAt,
        }))
      );

    if (deliveryError) {
      throw new Error(deliveryError.message);
    }

    // 4. Find available push tokens.
    const { data: tokens, error: tokenError } = await db
      .from("push_tokens")
      .select("user_id, expo_push_token")
      .in("user_id", optedInUsers);

    if (tokenError) {
      console.error("Could not retrieve push tokens:", tokenError);
    }

    const validTokens = (tokens ?? []) as PushToken[];

    let pushSent = 0;
    let pushFailed = 0;

    // 5. Send push notifications when devices are available.
    if (validTokens.length > 0) {
      const messages = validTokens.map((token) => ({
        to: token.expo_push_token,
        sound: "default",
        title: campaign.title,
        body: campaign.body,
        data: {
          campaignId,
          type: campaign.campaign_type,
          url: campaign.target_url,
          imageUrl: campaign.image_url,
        },
      }));

      for (let i = 0; i < messages.length; i += 100) {
        const batch = messages.slice(i, i + 100);

        try {
          const response = await fetch(
            "https://exp.host/--/api/v2/push/send",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(batch),
            }
          );

          if (!response.ok) {
            pushFailed += batch.length;
            continue;
          }

          const result = (await response.json()) as {
            data?: ExpoTicket[];
          };

          batch.forEach((_, index) => {
            if (result.data?.[index]?.status === "ok") {
              pushSent++;
            } else {
              pushFailed++;
            }
          });
        } catch (error) {
          console.error("Expo push batch failed:", error);
          pushFailed += batch.length;
        }
      }
    }

    // 6. Update campaign summary.
    const { error: updateError } = await db
      .from("notification_campaigns")
      .update({
        status: "SENT",
        total_recipients: optedInUsers.length,
        successful_deliveries: optedInUsers.length,
        failed_deliveries: 0,
        sent_at: sentAt,
      })
      .eq("id", campaignId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    revalidatePath("/notifications");

    return {
      success: true,
      total: optedInUsers.length,
      sent: optedInUsers.length,
      failed: 0,
      pushSent,
      pushFailed,
    };
  } catch (error) {
    await db
      .from("notification_campaigns")
      .update({ status: "FAILED" })
      .eq("id", campaignId);

    throw error;
  }
}