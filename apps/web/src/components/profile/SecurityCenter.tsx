"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  KeyRound,
  Laptop,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/auth/client";

interface Device {
  id: string;
  name: string;
  location: string;
  lastSeen: string;
  current: boolean;
}

interface Props {
  devices: Device[];
}

export default function SecurityCenter({ devices }: Props) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOutAll() {
    setSigningOut(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signOut({
        scope: "global",
      });

      if (error) {
        console.error("Global sign out error:", error);
        toast.error("Failed to sign out of all devices.");
        return;
      }

      toast.success("Signed out of all devices.");

      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Global sign out error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <section className="select-none border border-gray-200 bg-white p-6 shadow-none antialiased sm:p-8">
      {/* Header */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 sm:text-xl">
          Security Center
        </h2>

        <p className="mt-1 text-xs font-normal text-gray-500 sm:text-sm">
          Manage your account credentials, authentication methods, and active
          sessions.
        </p>
      </div>

      <div className="space-y-4">
        {/* Change Password */}
        <Link
          href="/auth/forgot-password"
          className="group flex items-center justify-between border border-gray-200 p-4 transition-colors duration-150 hover:border-gray-400 hover:bg-gray-50/75 sm:p-5"
        >
          <div className="flex items-center gap-3.5 sm:gap-4">
            <KeyRound className="h-5 w-5 shrink-0 stroke-[1.5] text-[#004d26]" />

            <div>
              <h3 className="text-sm font-medium text-gray-900 transition-colors group-hover:text-[#004d26]">
                Change Password
              </h3>

              <p className="mt-0.5 text-xs font-normal text-gray-500">
                Update your account password regularly to maintain account
                safety.
              </p>
            </div>
          </div>

          <ChevronRight className="h-4 w-4 stroke-[1.5] text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-gray-900" />
        </Link>

        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between border border-gray-200 bg-white p-4 transition-colors duration-150 sm:p-5">
          <div className="flex items-center gap-3.5 pr-4 sm:gap-4">
            <ShieldCheck className="h-5 w-5 shrink-0 stroke-[1.5] text-[#004d26]" />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>

                <span
                  className={`border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                    is2FAEnabled
                      ? "border-emerald-200 bg-emerald-50 text-[#004d26]"
                      : "border-gray-200 bg-gray-100 text-gray-500"
                  }`}
                >
                  {is2FAEnabled ? "Active" : "Disabled"}
                </span>
              </div>

              <p className="mt-0.5 text-xs font-normal text-gray-500">
                Require a verification code when signing in from an
                unrecognized device.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={is2FAEnabled}
            onClick={() => {
              setIs2FAEnabled((prev) => !prev);
              toast.info(
                "Two-factor authentication setup will be available soon.",
              );
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer border transition-colors duration-200 ease-in-out focus:outline-none ${
              is2FAEnabled
                ? "border-[#004d26] bg-[#004d26]"
                : "border-gray-300 bg-gray-200"
            }`}
          >
            <span className="sr-only">
              Toggle Two-Factor Authentication
            </span>

            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform bg-white shadow-none ring-0 transition duration-200 ease-in-out ${
                is2FAEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Active Devices */}
        <div className="border border-gray-200 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <Laptop className="h-5 w-5 shrink-0 stroke-[1.5] text-[#004d26]" />

            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Active Devices
              </h3>

              <p className="mt-0.5 text-xs font-normal text-gray-500">
                Authorized browsers and native sessions currently signed in.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {devices.length === 0 ? (
              <p className="py-2 text-xs font-normal text-gray-500">
                No active devices found.
              </p>
            ) : (
              devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between border border-gray-100 bg-gray-50/50 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 shrink-0 stroke-[1.5] text-gray-500" />

                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {device.name}
                      </p>

                      <p className="text-[11px] font-normal text-gray-500">
                        {device.location} • Last active: {device.lastSeen}
                      </p>
                    </div>
                  </div>

                  {device.current && (
                    <span className="border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#004d26]">
                      Current Device
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sign Out All Devices */}
        <button
          type="button"
          onClick={handleSignOutAll}
          disabled={signingOut}
          className="flex w-full cursor-pointer items-center justify-center gap-2 border border-red-200 bg-white py-3 text-xs font-medium uppercase tracking-wider text-red-600 shadow-none transition-colors duration-150 hover:bg-red-50/75 disabled:pointer-events-none disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 stroke-[1.5]" />

          <span>
            {signingOut
              ? "Signing Out..."
              : "Sign Out of All Devices"}
          </span>
        </button>

        {/* Danger Zone */}
<div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-5 sm:p-6">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
    <div className="flex items-start gap-3.5">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
        <Trash2 className="size-4.5 stroke-[1.75]" />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-950">
          Delete Account
        </h3>

        <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-gray-600">
          Permanently remove your account and eligible account data.
          This action is irreversible.
        </p>

        <Link
          href="/account/delete/policy"
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
        >
          Read Account Deletion Policy
          <ChevronRight className="size-3" />
        </Link>
      </div>
    </div>

    <div className="pt-2 sm:pt-0 sm:shrink-0">
      <Link
        href="/account/delete"
        className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
      >
        Delete Account
      </Link>
    </div>
  </div>
</div>

        {/* Security Notice */}
        <div className="flex items-start gap-3 border border-gray-200 bg-gray-50 p-4">
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-gray-500" />

          <p className="text-xs leading-5 text-gray-500">
            If you notice suspicious activity on your account, change your
            password immediately and sign out of all devices.
          </p>
        </div>
      </div>
    </section>
  );
}