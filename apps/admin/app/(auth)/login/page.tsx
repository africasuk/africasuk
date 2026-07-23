"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LoginPage() {
  const supabase = createClient();

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

async function login() {
  setLoading(true);

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    setLoading(false);
    toast.error(error.message);
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    setLoading(false);
    toast.error("User not found.");
    return;
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .single();

  setLoading(false);

  if (profileError || !profile) {
    toast.error("Profile not found.");
    return;
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();

    toast.error(
      "Your account has been deactivated."
    );

    return;
  }

  toast.success("Welcome back!");

  switch (profile.role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      router.replace("/");
      break;

    case "MANAGER":
      router.replace("/manager");
      break;

    case "STAFF":
      router.replace("/staff");
      break;

    default:
      router.replace("/unauthorized");
      break;
  }

  router.refresh();
}



  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Sign in
          </CardTitle>

          <CardDescription>
            Welcome back to AfricaSuk
            Admin.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>

            <Input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />
          </div>

          <Button
            className="w-full"
            disabled={loading}
            onClick={login}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </Button>
          
        </CardContent>
      </Card>
    </div>
  );
}