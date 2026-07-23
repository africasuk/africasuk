"use client";

import { useState } from "react";
import { Bell, Mail, Shield, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  securityAlerts: boolean;
}

interface Props {
  initialPreferences: NotificationPreferences;
  onSave?: (
    preferences: NotificationPreferences
  ) => Promise<void>;
}

export default function NotificationPreferences({
  initialPreferences,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [preferences, setPreferences] =
    useState(initialPreferences);

  async function save() {
    try {
      setLoading(true);

      if (onSave) {
        await onSave(preferences);
      }

      toast.success(
        "Notification preferences updated."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to save preferences."
      );
    } finally {
      setLoading(false);
    }
  }

  const items = [
    {
      key: "emailNotifications",
      title: "Email Notifications",
      description:
        "Receive updates by email.",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      key: "smsNotifications",
      title: "SMS Notifications",
      description:
        "Receive important SMS updates.",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      key: "pushNotifications",
      title: "Push Notifications",
      description:
        "Receive browser or mobile notifications.",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      key: "orderUpdates",
      title: "Order Updates",
      description:
        "Shipping, delivery and returns.",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      key: "promotions",
      title: "Promotions",
      description:
        "Receive discounts and special offers.",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      key: "securityAlerts",
      title: "Security Alerts",
      description:
        "Always receive security notifications.",
      icon: <Shield className="h-5 w-5" />,
    },
  ] as const;

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Notifications
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose how AfricaSuk contacts you.
        </p>
      </div>

      <div className="space-y-5">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-2xl border p-4"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#004d26]/10 p-3 text-[#004d26]">
                {item.icon}
              </div>

              <div>
                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={preferences[item.key]}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  [item.key]:
                    e.target.checked,
                })
              }
              className="h-5 w-5 accent-[#004d26]"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          disabled={loading}
          onClick={save}
          className="rounded-xl bg-[#004d26] px-6 py-3 font-semibold text-white hover:bg-[#003b1d] disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Preferences"}
        </button>
      </div>
    </section>
  );
}