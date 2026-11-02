"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2 } from "lucide-react";

export default function AnalyticsButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      router.push("/orders/analytics");
    });
  }

  return (
    <Button onClick={handleClick} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Loading Analytics...
        </>
      ) : (
        <>
          <BarChart3 className="mr-2 size-4" />
          View E-commerce Analytics
        </>
      )}
    </Button>
  );
}