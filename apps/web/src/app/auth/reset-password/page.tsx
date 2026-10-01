"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/auth/client";
import { useTranslation } from "@/components/providers/LanguageProvider";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { dictionary } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  const verificationStarted = useRef(false);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    if (verificationStarted.current) return;

    verificationStarted.current = true;

    async function verifyRecoveryToken() {
      const params = new URLSearchParams(window.location.search);

      const tokenHash = params.get("token_hash");
      const type = params.get("type");

      if (!tokenHash || type !== "recovery") {
        setVerifying(false);
        setVerified(false);
        return;
      }

      const supabase = createClient();

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });

      if (error) {
        console.error("Recovery verification error:", error);

        toast.error("This password reset link is invalid or expired.");

        setVerifying(false);
        setVerified(false);
        return;
      }

      window.history.replaceState(
        {},
        "",
        "/auth/reset-password",
      );

      setVerified(true);
      setVerifying(false);
    }

    verifyRecoveryToken();
  }, []);

  async function handleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!verified) {
      toast.error("Your password reset session is invalid or expired.");
      return;
    }

    if (password.length < 8) {
      toast.error(dictionary.auth.passwordMinLength);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(dictionary.auth.passwordsDoNotMatch);
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      console.error("Password update error:", error);
      toast.error(error.message);
      return;
    }

    toast.success(dictionary.auth.passwordUpdated);

    await supabase.auth.signOut();

    router.push("/auth/login");
  }

  if (verifying) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <p className="text-sm text-muted-foreground">
          Verifying reset link...
        </p>
      </main>
    );
  }

  if (!verified) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
        <div className="w-full max-w-md rounded-2xl border border-muted bg-background p-8 text-center shadow-xl sm:p-10">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Invalid Reset Link
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            This password reset link is invalid or has expired.
            Please request a new password reset email.
          </p>

          <button
            type="button"
            onClick={() => router.push("/auth/forgot-password")}
            className="mt-6 w-full cursor-pointer rounded-xl bg-[#004d26] py-3 text-sm font-bold tracking-wide text-white transition-all duration-200 hover:bg-[#003b1d]"
          >
            Request New Reset Link
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6 antialiased selection:bg-[#004d26]/10">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-2xl border border-muted bg-background p-8 shadow-xl shadow-green-950/2 sm:p-10"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {dictionary.auth.resetPasswordTitle}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {dictionary.auth.resetPasswordDescription}
          </p>
        </div>

        <div className="mt-6 space-y-4">
          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={dictionary.auth.newPassword}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-muted bg-background p-3 pr-12 text-sm outline-none shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26]"
              required
              minLength={8}
              autoComplete="new-password"
            />

            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder={dictionary.auth.confirmPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-xl border bg-background p-3 pr-12 text-sm outline-none shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:ring-1 ${
                  passwordsDoNotMatch
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : passwordsMatch
                      ? "border-[#004d26] focus:border-[#004d26] focus:ring-[#004d26]"
                      : "border-muted focus:border-[#004d26] focus:ring-[#004d26]"
                }`}
                required
                minLength={8}
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>

            {passwordsDoNotMatch && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                Passwords do not match.
              </p>
            )}

            {passwordsMatch && (
              <p className="mt-1.5 text-xs font-medium text-[#004d26]">
                Passwords match.
              </p>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-5 rounded-xl border border-muted bg-muted/30 p-4">
          <p className="text-xs leading-5 text-muted-foreground">
            If you did not request this password reset, please reset
            your password immediately or contact{" "}
            <a
              href="mailto:support@africasuk.com"
              className="font-semibold text-[#004d26] hover:underline"
            >
              support@africasuk.com
            </a>
            .
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || passwordsDoNotMatch}
          className="mt-6 w-full cursor-pointer rounded-xl bg-[#004d26] py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-green-950/5 transition-all duration-200 hover:bg-[#003b1d] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          {loading
            ? dictionary.auth.updatingPassword
            : dictionary.auth.updatePassword}
        </button>
      </form>
    </main>
  );
}