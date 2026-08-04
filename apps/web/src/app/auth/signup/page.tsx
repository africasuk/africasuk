"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { FcGoogle } from "react-icons/fc"; // TEMPORARILY DISABLED
import { toast } from "sonner";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider"; // Translation Hook Import
import {
  signupSchema,
  type SignupFormData,
} from "@/validation/signup.schema";
import { signUp } from "@/lib/auth/signup";
// import { signInWithGoogle } from "@/lib/auth/google"; // TEMPORARILY DISABLED

export default function SignupPage() {
  const router = useRouter();
  const { dictionary } = useTranslation(); // Destructuring Dictionary Definitions

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
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(dictionary.auth.welcomeToAfricaSuk);
    reset();
    router.refresh();
    router.push("/");
  };

  /* TEMPORARILY DISABLED: Google Signup Handler
  const handleGoogleSignup = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
    }
  };
  */

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6 antialiased selection:bg-[#004d26]/10">
      <div className="w-full max-w-md rounded-2xl border border-muted bg-background p-8 sm:p-10 shadow-xl shadow-green-950/2">

        {/* Brand Header Stack */}
        <div className="mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="mb-5 transform scale-105 select-none">
            <Logo />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {dictionary.auth.signupTitle}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {dictionary.auth.signupSubtitle}
          </p>
        </div>

        {/* TEMPORARILY DISABLED: Google Signup Provider & Separator */}
        {/* 
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-muted bg-background py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:bg-muted/50 hover:border-muted-foreground/20 active:scale-[0.99] cursor-pointer"
        >
          <FcGoogle size={20} />
          {dictionary.auth.continueWithGoogle}
        </button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-muted/60" />
          <span className="text-xs font-bold tracking-widest text-muted-foreground/60">
            {dictionary.auth.or}
          </span>
          <div className="h-px flex-1 bg-muted/60" />
        </div>
        */}

        {/* Signup Core Form Inputs */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Email Address */}
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

          {/* Core Submit Call Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#004d26] py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-green-950/5 transition-all duration-200 hover:bg-[#003b1d] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
          >
            {isSubmitting ? dictionary.auth.creatingAccount : dictionary.auth.createAccount}
          </button>
        </form>

        {/* Context Switching Footnote */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          {dictionary.auth.alreadyHaveAccount}{" "}
          <Link
            href="/auth/login"
            className="font-bold text-[#004d26] hover:underline hover:text-[#003b1d] transition-colors"
          >
            {dictionary.auth.login}
          </Link>
        </div>

      </div>
    </main>
  );
}