import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm"; // Adjust based on your folder architecture

export const metadata: Metadata = {
  title: "Login | AfricaSuk",
  description: "Sign in to your premium AfricaSuk account to manage orders and view curated selections.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6 antialiased selection:bg-[#004d26]/10">
      <div className="w-full max-w-md rounded-2xl border border-muted bg-background shadow-xl shadow-green-950/2">
        {/* Renders your high-fidelity, brand-aligned login component */}
        <LoginForm />
      </div>
    </main>
  );
}