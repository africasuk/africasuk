"use client";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import Logo from "@/components/layout/header/Logo";
import { useTranslation } from "@/components/providers/LanguageProvider";

import { login } from "@/lib/auth/login";
import { signInWithGoogle } from "@/lib/auth/google";

import {
  loginSchema,
  type LoginFormData,
} from "@/validation/login.schema";

export default function LoginForm() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const redirectTo =
    searchParams.get("redirect") ??
    "/";

  const { dictionary } =
    useTranslation();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(
      loginSchema
    ),
  });

  const onSubmit = async (
    data: LoginFormData
  ) => {
    const { error } = await login({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      dictionary.auth.welcomeBackToast
    );

    router.replace(redirectTo);

    router.refresh();
  };

  const handleGoogleLogin =
    async () => {
      const { error } =
        await signInWithGoogle(
          redirectTo
        );

      if (error) {
        toast.error(error.message);
      }
    };

  return (
    <div className="p-8 sm:p-10">
      <div className="mb-8 flex flex-col items-center text-center sm:items-start sm:text-left">
        <div className="mb-5 scale-105 select-none">
          <Logo />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {
            dictionary.auth
              .welcomeBack
          }
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {
            dictionary.auth
              .signInSubtitle
          }
        </p>
      </div>

      <button
        type="button"
        onClick={
          handleGoogleLogin
        }
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-muted bg-background py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:border-muted-foreground/20 hover:bg-muted/50 active:scale-[0.99]"
      >
        <FcGoogle size={20} />

        {
          dictionary.auth
            .continueWithGoogle
        }
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-muted/60" />

        <span className="text-xs font-bold tracking-widest text-muted-foreground/60">
          {dictionary.auth.or}
        </span>

        <div className="h-px flex-1 bg-muted/60" />
      </div>

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-4"
      >
        <div>
          <input
            type="email"
            placeholder={
              dictionary.auth
                .emailAddress
            }
            {...register("email")}
            className="w-full rounded-xl border border-muted bg-background p-3 text-sm shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26]"
          />

          {errors.email && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {
                errors.email
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder={
              dictionary.auth
                .password
            }
            {...register(
              "password"
            )}
            className="w-full rounded-xl border border-muted bg-background p-3 text-sm shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26]"
          />

          {errors.password && (
            <p className="mt-1.5 text-xs font-medium text-destructive">
              {
                errors.password
                  .message
              }
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs font-semibold tracking-wide text-[#004d26] transition-colors hover:text-[#003b1d] hover:underline"
          >
            {
              dictionary.auth
                .forgotPassword
            }
          </Link>
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="w-full cursor-pointer rounded-xl bg-[#004d26] py-3 text-sm font-bold tracking-wide text-white shadow-md shadow-green-950/5 transition-all duration-200 hover:bg-[#003b1d] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting
            ? dictionary.auth
                .signingIn
            : dictionary.auth
                .login}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {
          dictionary.auth
            .noAccount
        }{" "}
        <button
          type="button"
          className="cursor-pointer font-bold text-[#004d26] transition-colors hover:text-[#003b1d] hover:underline"
        >
          {
            dictionary.auth
              .createAccount
          }
        </button>
      </div>
    </div>
  );
}