"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Terminal, ShieldAlert, Cpu, Activity } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import ThemeToggle from "@/components/shared/ThemeToggle"; // Adjust import path if needed

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

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
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

    const { data: profile, error: profileError } = await supabase
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
      toast.error("Your account has been deactivated.");
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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 dark:bg-zinc-950 light:bg-zinc-100 p-6 text-zinc-300 font-mono transition-colors">
      
      {/* Reusable Theme Toggle Positioned in Top-Right Corner */}
      <div className="absolute top-4 right-4 z-10 border border-zinc-800 dark:border-zinc-800 light:border-zinc-300 rounded-md bg-zinc-900/80 dark:bg-zinc-900/80 light:bg-white text-zinc-400 hover:text-zinc-100 backdrop-blur-sm">
        <ThemeToggle />
      </div>

      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-size-[2rem_2rem] pointer-events-none" />

      <Card className="relative w-full max-w-md border-zinc-800 bg-zinc-900/90 dark:bg-zinc-900/90 dark:border-zinc-800 light:bg-white light:border-zinc-200 backdrop-blur-sm shadow-2xl shadow-black/80 text-zinc-300 dark:text-zinc-300 light:text-zinc-800">
        <CardHeader className="space-y-2 border-b border-zinc-800/80 dark:border-zinc-800/80 light:border-zinc-200 pb-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-sans tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Node: DX-8041
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-zinc-400" /> System Online
            </span>
          </div>

          <CardTitle className="text-base font-semibold text-zinc-100 dark:text-zinc-100 light:text-zinc-900 flex items-center gap-2 pt-1">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Diagnostic & Runtime Terminal
          </CardTitle>

          <CardDescription className="text-xs text-zinc-400 dark:text-zinc-400 light:text-zinc-600 font-mono">
            Enter valid telemetry key pair to access environment runtime.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={login} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-zinc-700 font-mono flex items-center gap-1">
                <span>Access ID / Operator Email</span>
              </Label>
              <Input
                type="email"
                placeholder="operator@node.internal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-950/70 border-zinc-800 text-zinc-200 dark:bg-zinc-950/70 dark:border-zinc-800 dark:text-zinc-200 light:bg-zinc-50 light:border-zinc-300 light:text-zinc-900 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 font-mono text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-zinc-400 dark:text-zinc-400 light:text-zinc-700 font-mono">
                Security Token / Auth Key
              </Label>
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-950/70 border-zinc-800 text-zinc-200 dark:bg-zinc-950/70 dark:border-zinc-800 dark:text-zinc-200 light:bg-zinc-50 light:border-zinc-300 light:text-zinc-900 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 font-mono text-xs"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 light:bg-zinc-900 light:hover:bg-zinc-800 light:text-white border border-zinc-700/60 font-mono text-xs tracking-wider uppercase transition-all duration-200 mt-2 hover:border-zinc-500 active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  Verifying Token...
                </span>
              ) : (
                "Execute Authentication Diagnostic"
              )}
            </Button>
          </form>

          {/* Diagnostic Footer */}
          <div className="mt-6 pt-4 border-t border-zinc-800/60 dark:border-zinc-800/60 light:border-zinc-200 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-zinc-500" />
              Restricted Subsystem
            </span>
            <span>v4.18.0-prod</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}