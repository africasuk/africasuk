"use client";

import { createClient } from "@/lib/auth/client";

export async function logout() {
  const supabase = createClient();

  return await supabase.auth.signOut();
}