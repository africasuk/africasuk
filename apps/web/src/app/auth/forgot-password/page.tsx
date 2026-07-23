"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider"; // Translation Hook Import
import { forgotPassword } from "@/lib/auth/forgot-password";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { dictionary } = useTranslation(); // Destructuring Dictionary Definitions

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const { error } = await forgotPassword(email);
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(dictionary.auth.emailSent);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6 antialiased selection:bg-[#004d26]/10">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-2xl border border-muted bg-background p-8 sm:p-10 shadow-xl shadow-green-950/2"
      >
        {/* Brand Header Stack */}
        <div className="mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="mb-5 transform scale-105 select-none">
            <Logo />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {dictionary.auth.forgotPasswordTitle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {dictionary.auth.forgotPasswordDescription}
          </p>
        </div>

        {/* Form Inputs */}
        <div className="mt-6">
          <input
            type="email"
            placeholder={dictionary.auth.emailAddress}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-muted bg-background p-3 text-sm outline-none shadow-sm transition-all duration-200 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26] placeholder:text-muted-foreground/60"
            required
          />
        </div>

        {/* Primary Call to Action */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-[#004d26] py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-green-950/5 transition-all duration-200 hover:bg-[#003b1d] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {loading
            ? dictionary.auth.sendingLink
            : dictionary.auth.sendResetLink}
        </button>

        {/* Dynamic Back-to-Login Navigation */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-[#004d26] transition-colors hover:text-[#003b1d]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            {dictionary.auth.backToLogin}
          </Link>
        </div>
      </form>
    </main>
  );
}