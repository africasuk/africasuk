"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider";

import { login } from "@/lib/auth/login";

import {
  loginSchema,
  type LoginFormData,
} from "@/validation/login.schema";

export default function LoginForm() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const { dictionary } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const { data: loginData, error } = await login({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    const user = loginData.user;

    if (user?.email) {
      await fetch("/api/email/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email.split("@")[0],
        }),
      });
    }

    toast.success(dictionary.auth.welcomeBackToast);
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <div className="p-8 sm:p-10">
      <div className="mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
        <div className="mb-5 scale-105 select-none">
          <Logo />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {dictionary.auth.welcomeBack}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {dictionary.auth.signInSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder={dictionary.auth.emailAddress}
            {...register("email")}
            className="w-full rounded-xl border border-muted bg-background p-3 text-sm shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26]"
          />

          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={dictionary.auth.password}
              {...register("password")}
              className="w-full rounded-xl border border-muted bg-background p-3 pr-10 text-sm shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground/70 transition-colors hover:text-foreground focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4.5 stroke-[1.75]" />
              ) : (
                <Eye className="size-4.5 stroke-[1.75]" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold tracking-wide text-[#004d26] transition-colors hover:text-[#003b1d] hover:underline"
          >
            {dictionary.auth.forgotPassword}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-xl bg-[#004d26] py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-green-950/5 transition-all duration-200 hover:bg-[#003b1d] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting
            ? dictionary.auth.signingIn
            : dictionary.auth.login}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {dictionary.auth.noAccount}{" "}
        <Link
          href="/auth/signup"
          className="font-bold text-[#004d26] transition-colors hover:text-[#003b1d] hover:underline"
        >
          {dictionary.auth.createAccount}
        </Link>
      </div>
    </div>
  );
}