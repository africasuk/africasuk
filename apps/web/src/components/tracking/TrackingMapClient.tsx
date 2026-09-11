"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { OrderStatus } from "@africasuk/types";

const TrackingMap = dynamic(
  () => import("@/components/tracking/TrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-120 sm:h-135 lg:h-150 w-full select-none flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200/90 bg-zinc-50">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" strokeWidth={2} />
        <span className="text-xs font-medium text-zinc-500">
          Initializing telemetry map...
        </span>
      </div>
    ),
  }
);

interface Props {
  status: OrderStatus;
}

export default function TrackingMapClient({ status }: Props) {
  return <TrackingMap status={status} />;
}