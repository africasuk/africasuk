import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase =
    await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getCurrentProfile() {
  const user = await requireAuth();

  const supabase =
    await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function requireRole(
  roles: string[]
) {
  const profile =
    await getCurrentProfile();

  if (!roles.includes(profile.role)) {
    redirect("/unauthorized");
  }

  return profile;
}

export async function requireSuperAdmin() {
  return requireRole([
    "SUPER_ADMIN",
  ]);
}