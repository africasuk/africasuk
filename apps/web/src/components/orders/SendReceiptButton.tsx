"use client";

import { useState } from "react";
import { Mail, Check, Loader2 } from "lucide-react";

interface Props {
  orderNumber: string;
}

export function SendReceiptButton({ orderNumber }: Props) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSend() {
    if (loading || sent) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/orders/${encodeURIComponent(orderNumber)}/receipt`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send receipt.");
      }

      setSent(true);

      setTimeout(() => {
        setSent(false);
      }, 5000);
    } catch (error) {
      console.error("Send receipt error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to send receipt."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleSend}
        disabled={loading || sent}
        className="inline-flex items-center justify-center gap-2 border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : sent ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" />
            Receipt Sent
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" />
            Send Receipt
          </>
        )}
      </button>

      {error && (
        <p className="max-w-55 text-right text-[11px] text-red-600">
          {error}
        </p>
      )}

      {sent && (
        <p className="text-[11px] text-emerald-600">
          Receipt sent to your email.
        </p>
      )}
    </div>
  );
}