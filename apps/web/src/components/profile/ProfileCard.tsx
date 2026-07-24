"use client";

import Image from "next/image";
import {
  Camera,
  Pencil,
  User,
  ShieldCheck,
  Mail,
} from "lucide-react";

import type { Profile } from "@africasuk/types";

interface Props {
  profile: Profile;
  onEdit(): void;
  onChangeAvatar(): void;
}

export default function ProfileCard({
  profile,
  onEdit,
  onChangeAvatar,
}: Props) {
  return (
    <section className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs antialiased select-none">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        
        {/* User Identity Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          
          {/* Avatar Stack with Trigger */}
          <div className="relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-2 border-emerald-100 bg-gray-50/80 shadow-inner">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName ?? "User Profile"}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-400" />
              )}
            </div>

            <button
              type="button"
              onClick={onChangeAvatar}
              aria-label="Change profile picture"
              className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-r from-[#002b15] to-[#005c2e] text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* User Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#002b15]">
                {profile.fullName || "AfricaSuk User"}
              </h1>
              <ShieldCheck className="h-5 w-5 text-[#005c2e]" />
            </div>

            <p className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-500">
              <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <span>{profile.email}</span>
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#005c2e]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#005c2e]" />
                {profile.role.replaceAll("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200/80 bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wider text-[#002b15] shadow-2xs hover:bg-emerald-50/50 hover:border-emerald-200 transition-all active:scale-98 cursor-pointer shrink-0"
        >
          <Pencil className="h-4 w-4 text-[#005c2e]" />
          <span>Edit Profile</span>
        </button>

      </div>
    </section>
  );
}