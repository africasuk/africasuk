"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider";

import {
  signupSchema,
  type SignupFormData,
} from "@/validation/signup.schema";

import { signUp } from "@/lib/auth/signup";

export default function SignupPage() {
  const router = useRouter();
  const { dictionary } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    const { error } = await signUp({
      fullName: data.fullName,
      email: data.email.trim().toLowerCase(),
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    // Welcome email
    try {
      await fetch("/api/email/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          name: data.fullName,
        }),
      });
    } catch (error) {
      console.error("Welcome email error:", error);
    }

    toast.success(dictionary.auth.welcomeToAfricaSuk);

    reset();

    router.refresh();
    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6 antialiased selection:bg-[#004d26]/10">
      <div className="w-full max-w-md rounded-2xl border border-muted bg-background p-8 shadow-xl shadow-green-950/2 sm:p-10">

        {/* Brand Header */}
        <div className="mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="mb-5 scale-105 transform select-none">
            <Logo />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {dictionary.auth.signupTitle}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {dictionary.auth.signupSubtitle}
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Full Name */}
          <div>
            <input
              {...register("fullName")}
              placeholder={dictionary.auth.fullName}
              className="w-full rounded-xl border border-muted bg-background p-3 text-sm outline-none shadow-sm transition-all duration-200 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26] placeholder:text-muted-foreground/60"
            />

            {errors.fullName && (
              <p className="mt-1.5 text-xs font-medium text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder={dictionary.auth.emailAddress}
              className="w-full rounded-xl border border-muted bg-background p-3 text-sm outline-none shadow-sm transition-all duration-200 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26] placeholder:text-muted-foreground/60"
            />

            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}

            {/* Working Email Notice */}
            <div className="mt-2 rounded-xl border border-[#004d26]/10 bg-[#004d26]/5 px-3 py-2.5">
              <p className="text-xs leading-5 text-muted-foreground">
                Please use a working email address. We’ll use it to send
                important account, order, payment, and other AfricaSuk updates.
              </p>
            </div>
          </div>

          {/* Password */}
          <div>
            <input
              {...register("password")}
              type="password"
              placeholder={dictionary.auth.password}
              className="w-full rounded-xl border border-muted bg-background p-3 text-sm outline-none shadow-sm transition-all duration-200 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26] placeholder:text-muted-foreground/60"
            />

            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder={dictionary.auth.confirmPassword}
              className="w-full rounded-xl border border-muted bg-background p-3 text-sm outline-none shadow-sm transition-all duration-200 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26] placeholder:text-muted-foreground/60"
            />

            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs font-medium text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms & Privacy */}
          <div className="pt-1">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("acceptTerms")}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#004d26]"
              />

              <span className="text-xs leading-5 text-muted-foreground">
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-semibold text-[#004d26] hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="font-semibold text-[#004d26] hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {errors.acceptTerms && (
              <p className="mt-1.5 text-xs font-medium text-destructive">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          {/* Create Account */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full cursor-pointer rounded-xl bg-[#004d26] py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-green-950/5 transition-all duration-200 hover:bg-[#003b1d] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
          >
            {isSubmitting
              ? dictionary.auth.creatingAccount
              : dictionary.auth.createAccount}
          </button>
        </form>

        {/* Login */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {dictionary.auth.alreadyHaveAccount}{" "}
          <Link
            href="/auth/login"
            className="font-bold text-[#004d26] transition-colors hover:text-[#003b1d] hover:underline"
          >
            {dictionary.auth.login}
          </Link>
        </div>
      </div>
    </main>
  );
}