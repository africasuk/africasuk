"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/auth/client";
import { useTranslation } from "@/components/providers/LanguageProvider"; // Translation Hook Import

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const { dictionary } = useTranslation(); // Destructuring Dictionary Definitions

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(dictionary.auth.passwordsDoNotMatch);
      return;
    }

    if (password.length < 8) {
      toast.error(dictionary.auth.passwordMinLength);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(dictionary.auth.passwordUpdated);
    router.push("/auth/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6 antialiased selection:bg-[#004d26]/10">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-2xl border border-muted bg-background p-8 sm:p-10 shadow-xl shadow-green-950/2"
      >
        {/* Header Stack */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {dictionary.auth.resetPasswordTitle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {dictionary.auth.resetPasswordDescription}
          </p>
        </div>

        {/* Form Inputs Container */}
        <div className="mt-6 space-y-4">
          <div>
            <input
              type="password"
              placeholder={dictionary.auth.newPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-muted bg-background p-3 text-sm outline-none shadow-sm transition-all duration-200 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26] placeholder:text-muted-foreground/60"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder={dictionary.auth.confirmPassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-muted bg-background p-3 text-sm outline-none shadow-sm transition-all duration-200 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26] placeholder:text-muted-foreground/60"
              required
            />
          </div>
        </div>

        {/* Submission Trigger */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-[#004d26] py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-green-950/5 transition-all duration-200 hover:bg-[#003b1d] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {loading ? dictionary.auth.updatingPassword : dictionary.auth.updatePassword}
        </button>
      </form>
    </main>
  );
}