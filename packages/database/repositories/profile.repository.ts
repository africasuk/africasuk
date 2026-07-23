import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Profile,
  Language,
  UserRole,
} from "@africasuk/types";

interface ProfileRow {
  id: string;
  user_id: string;

  full_name: string;
  email: string;
  phone: string | null;

  avatar_url: string | null;

  role: UserRole;
  language: Language;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export class ProfileRepository {
  private static map(
    row: ProfileRow
  ): Profile {
    return {
      id: row.id,
      userId: row.user_id,

      fullName: row.full_name,
      email: row.email,
      phone: row.phone,

      avatarUrl: row.avatar_url,

      role: row.role,
      language: row.language,

      isActive: row.is_active,

      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  static async getByUserId(
    supabase: SupabaseClient,
    userId: string
  ): Promise<Profile> {
    const { data, error } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error) {
      throw error;
    }

    return this.map(
      data as ProfileRow
    );
  }

  static async update(
    supabase: SupabaseClient,
    userId: string,
    updates: Partial<Profile>
  ): Promise<Profile> {
    const payload: Partial<ProfileRow> = {};

    if (
      updates.fullName !== undefined
    ) {
      payload.full_name =
        updates.fullName;
    }

    if (
      updates.email !== undefined
    ) {
      payload.email =
        updates.email;
    }

    if (
      updates.phone !== undefined
    ) {
      payload.phone =
        updates.phone;
    }

    if (
      updates.avatarUrl !== undefined
    ) {
      payload.avatar_url =
        updates.avatarUrl;
    }

    if (
      updates.role !== undefined
    ) {
      payload.role =
        updates.role;
    }

    if (
      updates.language !== undefined
    ) {
      payload.language =
        updates.language;
    }

    if (
      updates.isActive !== undefined
    ) {
      payload.is_active =
        updates.isActive;
    }

    payload.updated_at =
      new Date().toISOString();

    const query = supabase
  .from("profiles")
  .update(payload)
  .eq("user_id", userId)
  .select();

const { data, error } = await query;

console.log("Updated rows:", data);
console.log("User ID:", userId);
console.log("Payload:", payload);

if (error) throw error;

if (!data || data.length === 0) {
  throw new Error(
    "No profile was updated."
  );
}

return this.map(data[0] as ProfileRow);
  }
}