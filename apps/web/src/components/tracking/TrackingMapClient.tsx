
"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { OrderStatus } from "@africasuk/types";

const TrackingMap = dynamic(
  () => import("@/components/tracking/TrackingMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-57.5 w-full flex-col items-center justify-center gap-3 bg-zinc-50">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" strokeWidth={2} />
        <span className="text-xs font-medium text-zinc-500">
          Initializing tracking map...
        </span>
      </div>
    ),
  }
);

interface Props {
  status: OrderStatus;
}

export default function TrackingMapClient({ status }: Props) {
  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">
      <TrackingMap status={status} />
    </div>
  );
}
