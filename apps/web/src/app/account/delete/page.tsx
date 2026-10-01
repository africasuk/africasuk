"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/auth/client";

export default function DeleteAccountPage() {
  const router = useRouter();

  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!reason.trim()) {
      toast.error("Please enter a reason for deleting your account.");
      return;
    }

    if (!agreed) {
      toast.error("Please confirm that you understand.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to delete your account.",
        );
        return;
      }

      const supabase = createClient();

      await supabase.auth.signOut();

      toast.success("Your account has been deleted.");

      router.replace("/auth/login");
    } catch (error) {
      console.error("Delete account error:", error);

      toast.error(
        "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-muted bg-background p-6 shadow-xl sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Delete Account
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Permanently delete your AfricaSuk account.
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-semibold text-rose-800">
            This action is permanent.
          </p>

          <p className="mt-1 text-xs leading-5 text-rose-700">
            Your account and eligible account data will be
            permanently deleted. You will not be able to recover
            your account after deletion.
          </p>
        </div>

        {/* Reason */}
        <div className="mt-6">
          <label
            htmlFor="deletion-reason"
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            Why are you deleting your account?
          </label>

          <textarea
            id="deletion-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            rows={5}
            maxLength={500}
            placeholder="Tell us why you are deleting your account..."
            className="w-full resize-none rounded-xl border border-muted bg-background p-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26] disabled:opacity-50"
          />

          <div className="mt-1 text-right text-[11px] text-muted-foreground">
            {reason.length}/500
          </div>
        </div>

        {/* Agreement */}
        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-muted p-4">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            disabled={loading}
            className="mt-1 size-4 cursor-pointer accent-[#004d26]"
          />

          <span className="text-sm leading-5 text-muted-foreground">
            I understand that deleting my account is permanent
            and that eligible account data may be permanently
            deleted.
          </span>
        </label>

        {/* Delete */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={!reason.trim() || !agreed || loading}
          className="mt-6 w-full cursor-pointer rounded-xl bg-rose-600 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? "Deleting Account..." : "Permanently Delete Account"}
        </button>

        {/* Back */}
        <Link
          href="/account"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Cancel
        </Link>

        {/* Policy */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Please review our{" "}
          <Link
            href="/account/delete/policy"
            className="font-semibold text-[#004d26] hover:underline"
          >
            Account Deletion Policy
          </Link>{" "}
          before continuing.
        </p>
      </div>
    </main>
  );
}