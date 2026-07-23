import { createClient } from "./client";

type SignupData = {
  fullName: string;
  email: string;
  password: string;
};

export async function signUp({
  fullName,
  email,
  password,
}: SignupData) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  return {
    data,
    error,
  };
}