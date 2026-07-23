"use client";

import Image from "next/image";
import {
  Camera,
  Pencil,
  User,
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
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-muted">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={
                    profile.fullName ??
                    "User"
                  }
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>

            <button
              type="button"
              onClick={
                onChangeAvatar
              }
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#004d26] text-white shadow transition hover:bg-[#003b1d]"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              {profile.fullName ||
                "AfricaSuk User"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {profile.email}
            </p>

            <span className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">
              {profile.role.replaceAll(
                "_",
                " "
              )}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 font-medium transition hover:bg-muted"
        >
          <Pencil className="h-4 w-4" />
          Edit Profile
        </button>
      </div>
    </section>
  );
}