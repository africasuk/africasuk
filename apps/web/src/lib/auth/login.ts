import { createClient } from "./client";

type LoginData = {
  email: string;
  password: string;
};

export async function login({
  email,
  password,
}: LoginData) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    data,
    error,
  };
}