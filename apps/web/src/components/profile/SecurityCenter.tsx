"use client";

import Link from "next/link";
import {
  ChevronRight,
  KeyRound,
  Laptop,
  LogOut,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

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

export default function SecurityCenter({
  devices,
}: Props) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Security Center
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Protect your AfricaSuk account.
        </p>
      </div>

      <div className="space-y-4">

        <Link
          href="/account/security/password"
          className="flex items-center justify-between rounded-2xl border p-5 transition hover:border-[#004d26]/30 hover:bg-muted/40"
        >
          <div className="flex items-center gap-4">
            <KeyRound className="h-6 w-6 text-[#004d26]" />

            <div>
              <h3 className="font-semibold">
                Change Password
              </h3>

              <p className="text-sm text-muted-foreground">
                Update your account password.
              </p>
            </div>
          </div>

          <ChevronRight className="h-5 w-5" />
        </Link>

        <Link
          href="/account/security/2fa"
          className="flex items-center justify-between rounded-2xl border p-5 transition hover:border-[#004d26]/30 hover:bg-muted/40"
        >
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-6 w-6 text-[#004d26]" />

            <div>
              <h3 className="font-semibold">
                Two-Factor Authentication
              </h3>

              <p className="text-sm text-muted-foreground">
                Add an extra layer of protection.
              </p>
            </div>
          </div>

          <ChevronRight className="h-5 w-5" />
        </Link>

        <div className="rounded-2xl border p-5">
          <div className="mb-5 flex items-center gap-3">
            <Laptop className="h-6 w-6 text-[#004d26]" />

            <div>
              <h3 className="font-semibold">
                Active Devices
              </h3>

              <p className="text-sm text-muted-foreground">
                Devices currently signed in.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {devices.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active devices found.
              </p>
            ) : (
              devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between rounded-xl border p-4"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-[#004d26]" />

                    <div>
                      <p className="font-medium">
                        {device.name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {device.location}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Last active: {device.lastSeen}
                      </p>
                    </div>
                  </div>

                  {device.current && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Current Device
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out of All Devices
        </button>

      </div>
    </section>
  );
}