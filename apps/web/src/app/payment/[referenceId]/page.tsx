"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const { referenceId } = useParams<{
    referenceId: string;
  }>();

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(
        `/api/payments/status/${referenceId}`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) return;

      const payment = await res.json();

      if (payment.status === "PAID") {
        clearInterval(interval);

        router.replace(
          `/account/orders/${payment.orderId}`,
        );
      }

      if (payment.status === "FAILED") {
        clearInterval(interval);

        router.replace(
          "/checkout?payment=failed",
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [referenceId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-xl font-semibold">
        Waiting for payment...
      </h1>
    </div>
  );
}