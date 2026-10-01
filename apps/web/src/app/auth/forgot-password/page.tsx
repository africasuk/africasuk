"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { forgotPassword } from "@/lib/auth/forgot-password";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { dictionary } = useTranslation();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setEmailSent(false);

    const { error } = await forgotPassword(email);

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setEmailSent(true);
    toast.success(dictionary.auth.emailSent);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6 antialiased selection:bg-[#004d26]/10">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-2xl border border-muted bg-background p-8 shadow-xl shadow-green-950/2 sm:p-10"
      >
        <div className="mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="mb-5 scale-105 select-none">
            <Logo />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {dictionary.auth.forgotPasswordTitle}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {dictionary.auth.forgotPasswordDescription}
          </p>
        </div>

        <div className="mt-6">
          <input
            type="email"
            placeholder={dictionary.auth.emailAddress}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-muted bg-background p-3 text-sm outline-none shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26]"
            required
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full cursor-pointer rounded-xl bg-[#004d26] py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-green-950/5 transition-all duration-200 hover:bg-[#003b1d] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          {loading
            ? dictionary.auth.sendingLink
            : dictionary.auth.sendResetLink}
        </button>

        {emailSent && (
          <div className="mt-5 rounded-xl border border-[#004d26]/15 bg-[#004d26]/5 p-4 text-center">
            <p className="text-sm font-semibold text-[#004d26]">
              Reset link sent.
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              If you do not receive the email, please check your Spam or Junk folder.
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              If you still cannot find it, contact{" "}
              <a
                href="mailto:support@africasuk.com"
                className="font-semibold text-[#004d26] hover:underline"
              >
                support@africasuk.com
              </a>
              .
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#004d26] transition-colors hover:text-[#003b1d]"
          >
            <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {dictionary.auth.backToLogin}
          </Link>
        </div>
      </form>
    </main>
  );
}