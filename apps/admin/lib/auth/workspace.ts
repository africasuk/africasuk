import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { Role } from "./roles";

export async function requireWorkspace(
  allowedRoles: Role[]
) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("id, user_id, role, is_active")
      .eq("user_id", user.id)
      .single();

  if (profileError || !profile) {
    redirect("/login");
  }

  if (!profile.is_active) {
    redirect("/login");
  }

  if (!allowedRoles.includes(profile.role as Role)) {
    redirect("/unauthorized");
  }

  return {
    user,
    profile,
    supabase,
  };
}