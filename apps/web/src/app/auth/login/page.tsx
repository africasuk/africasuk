import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login | Africa Suk",
  description:
    "Sign in to your Africa Suk account to manage your orders, track purchases, and shop online.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6 antialiased selection:bg-[#004d26]/10">
      <div className="w-full max-w-md rounded-2xl border border-muted bg-background shadow-xl shadow-green-950/2">
        <LoginForm />
      </div>
    </main>
  );
}