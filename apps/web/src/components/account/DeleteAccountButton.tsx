"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/auth/client";

export default function DeleteAccountButton() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
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

  function closeModal() {
    if (loading) return;

    setOpen(false);
    setReason("");
    setAgreed(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700"
      >
        Delete Account
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <AlertTriangle className="size-5" />
                </div>

                <h2 className="text-lg font-bold text-gray-900">
                  Delete Account
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="cursor-pointer text-gray-400 transition-colors hover:text-gray-900 disabled:pointer-events-none"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Warning */}
            <p className="mt-5 text-sm leading-6 text-gray-600">
              Deleting your AfricaSuk account is permanent. Your
              account and eligible account data will be deleted and
              you will not be able to recover your account.
            </p>

            {/* Policy */}
            <Link
              href="/account/delete"
              target="_blank"
              className="mt-3 inline-block text-sm font-semibold text-[#004d26] hover:underline"
            >
              Read Account Deletion Policy
            </Link>

            {/* Reason */}
            <div className="mt-5">
              <label
                htmlFor="deletion-reason"
                className="mb-2 block text-sm font-semibold text-gray-900"
              >
                Why are you deleting your account?
              </label>

              <textarea
                id="deletion-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
                rows={4}
                maxLength={500}
                placeholder="Tell us why you are deleting your account..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#004d26] focus:ring-1 focus:ring-[#004d26] disabled:opacity-50"
              />

              <div className="mt-1 text-right text-[11px] text-gray-400">
                {reason.length}/500
              </div>
            </div>

            {/* Agreement */}
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
                className="mt-1 size-4 cursor-pointer accent-[#004d26]"
              />

              <span className="text-sm leading-5 text-gray-600">
                I understand that deleting my account is permanent
                and that eligible account data may be permanently
                deleted.
              </span>
            </label>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="flex-1 cursor-pointer rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  !reason.trim() ||
                  !agreed ||
                  loading
                }
                className="flex-1 cursor-pointer rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}