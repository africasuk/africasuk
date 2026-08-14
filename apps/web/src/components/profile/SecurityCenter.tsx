"use client";

import { useState } from "react";
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

export default function SecurityCenter({ devices }: Props) {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  return (
    <section className="border border-gray-200 bg-white p-6 sm:p-8 select-none antialiased shadow-none">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
          Security Center
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 font-normal">
          Manage your account credentials, authentication methods, and active sessions.
        </p>
      </div>

      <div className="space-y-4">
        {/* Change Password */}
        <Link
          href="/auth/forgot-password"
          className="flex items-center justify-between border border-gray-200 p-4 sm:p-5 transition-colors duration-150 hover:border-gray-400 hover:bg-gray-50/75 group"
        >
          <div className="flex items-center gap-3.5 sm:gap-4">
            <KeyRound className="h-5 w-5 text-[#004d26] stroke-[1.5] shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-[#004d26] transition-colors">
                Change Password
              </h3>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Update your account password regularly to maintain account safety.
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all stroke-[1.5]" />
        </Link>

        {/* Two-Factor Authentication with Toggle */}
        <div className="flex items-center justify-between border border-gray-200 p-4 sm:p-5 bg-white transition-colors duration-150">
          <div className="flex items-center gap-3.5 sm:gap-4 pr-4">
            <ShieldCheck className="h-5 w-5 text-[#004d26] stroke-[1.5] shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${
                    is2FAEnabled
                      ? "bg-emerald-50 text-[#004d26] border-emerald-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {is2FAEnabled ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Require a verification code when signing in from an unrecognized device.
              </p>
            </div>
          </div>

          {/* Temporary Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={is2FAEnabled}
            onClick={() => setIs2FAEnabled((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer border transition-colors duration-200 ease-in-out focus:outline-none ${
              is2FAEnabled
                ? "bg-[#004d26] border-[#004d26]"
                : "bg-gray-200 border-gray-300"
            }`}
          >
            <span className="sr-only">Toggle Two-Factor Authentication</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform bg-white shadow-none ring-0 transition duration-200 ease-in-out ${
                is2FAEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Active Devices Section */}
        <div className="border border-gray-200 p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <Laptop className="h-5 w-5 text-[#004d26] stroke-[1.5] shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Active Devices
              </h3>
              <p className="text-xs text-gray-500 font-normal mt-0.5">
                Authorized browsers and native sessions currently signed in.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {devices.length === 0 ? (
              <p className="text-xs text-gray-500 font-normal py-2">
                No active devices found.
              </p>
            ) : (
              devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between border border-gray-100 bg-gray-50/50 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-gray-500 stroke-[1.5] shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-gray-900">
                        {device.name}
                      </p>
                      <p className="text-[11px] text-gray-500 font-normal">
                        {device.location} &bull; Last active: {device.lastSeen}
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

        {/* Global Sign Out Action */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 border border-red-200 bg-white py-3 text-xs font-medium uppercase tracking-wider text-red-600 transition-colors duration-150 hover:bg-red-50/75 cursor-pointer shadow-none"
        >
          <LogOut className="h-4 w-4 stroke-[1.5]" />
          <span>Sign Out of All Devices</span>
        </button>
      </div>
    </section>
  );
}