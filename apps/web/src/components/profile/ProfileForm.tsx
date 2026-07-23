"use client";

import { useState } from "react";
import { toast } from "sonner";

import type {
  Language,
  Profile,
} from "@africasuk/types";

import { createClient } from "@/lib/auth/client";
import { ProfileRepository } from "@africasuk/database";

interface Props {
  profile: Profile;
}

export default function ProfileForm({
  profile,
}: Props) {
  const supabase = createClient();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
  fullName: profile.fullName ?? "",
  phone: profile.phone ?? "",
  language: profile.language,
});

  async function save() {
    setLoading(true);

    try {
      await ProfileRepository.update(
        supabase,
        profile.userId,
        {
          fullName: form.fullName,
          phone: form.phone,
          language: form.language,
        }
      );

      toast.success("Profile updated.");
    } catch (error) {
        console.error(error);
        toast.error("Failed to update profile.");
        } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 rounded-xl border p-6">
      <div>
        <label className="mb-2 block text-sm font-medium">
          Full Name
        </label>

        <input
          value={form.fullName}
          onChange={(e) =>
            setForm({
              ...form,
              fullName: e.target.value,
            })
          }
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Email
        </label>

        <input
          value={profile.email}
          disabled
          className="w-full rounded-lg border bg-muted p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Phone
        </label>

        <input
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Language
        </label>

        <select
            value={form.language}
            onChange={(e) =>
                setForm({
                ...form,
                language: e.target.value as Language,
                })
            }
            className="w-full rounded-lg border p-3"
            >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            </select>
      </div>

      <button
        onClick={save}
        disabled={loading}
        className="rounded-lg bg-[#004d26] px-6 py-3 font-medium text-white"
      >
        {loading
          ? "Saving..."
          : "Save Changes"}
      </button>
    </div>
  );
}