import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Truck,
  Radio,
  CheckCircle2,
  CircleDot,
  ShieldCheck,
  Building2,
  Home,
  Clock,
  Package,
  Navigation,
} from "lucide-react";

import { OrderRepository } from "@africasuk/database";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import TrackingMapClient from "@/components/tracking/TrackingMapClient";

interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

const MILESTONES = [
  {
    id: "kampala",
    label: "Dispatched from Kampala Hub",
    sublabel: "Regional Sorting & Processing",
    icon: Building2,
    statuses: [
      "CONFIRMED",
      "PROCESSING",
      "READY_FOR_PICKUP",
      "IN_TRANSIT",
      "AT_BORDER",
      "AT_JUBA_WAREHOUSE",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ],
  },
  {
    id: "transit",
    label: "Cross-Border Transit",
    sublabel: "En route along Gulu Transport Corridor",
    icon: Truck,
    statuses: [
      "IN_TRANSIT",
      "AT_BORDER",
      "AT_JUBA_WAREHOUSE",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ],
  },
  {
    id: "border",
    label: "Customs & Nimule Clearance",
    sublabel: "Cross-Border Inspection Point",
    icon: ShieldCheck,
    statuses: ["AT_BORDER", "AT_JUBA_WAREHOUSE", "OUT_FOR_DELIVERY", "DELIVERED"],
  },
  {
    id: "juba",
    label: "Arrived at Juba Hub",
    sublabel: "Fulfillment & Sorting Depot",
    icon: Building2,
    statuses: ["AT_JUBA_WAREHOUSE", "OUT_FOR_DELIVERY", "DELIVERED"],
  },
  {
    id: "delivery",
    label: "Final Destination",
    sublabel: "Customer Delivery Handover",
    icon: Home,
    statuses: ["DELIVERED"],
  },
];

export default async function TrackOrderPage({ params }: Props) {
  const { orderNumber } = await params;

  const supabase = await createServerSupabaseClient();
  const repository = new OrderRepository(supabase);
  const order = await repository.findByOrderNumber(orderNumber);

  if (!order) notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 select-none antialiased sm:px-6 sm:py-8">
      {/* Top Header Navigation */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/account/orders/${order.orderNumber}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3.5 text-xs font-semibold text-zinc-800 shadow-2xs transition-all hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.985]"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-400" strokeWidth={2} />
          <span>Back to Order #{order.orderNumber}</span>
        </Link>

        <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-600" />
          <span>Live Corridor Telemetry</span>
        </div>
      </div>

      {/* Main Grid: Responsive Ordering (Map top on mobile, Right column on desktop) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        
        {/* MAP COLUMN: order-1 on mobile (top), lg:order-2 on desktop (right) */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <TrackingMapClient status={order.status} />
        </div>

        {/* DETAILS COLUMN: order-2 on mobile (bottom), lg:order-1 on desktop (left) */}
        <div className="order-2 lg:order-1 lg:col-span-5 space-y-4 lg:sticky lg:top-6">
          {/* Milestone Stepper Card */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs sm:p-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h2 className="text-sm font-bold tracking-tight text-zinc-900">
                  Shipment Milestones
                </h2>
                <p className="text-xs text-zinc-500">
                  Uganda to South Sudan Express Route
                </p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                <Package className="h-4 w-4 stroke-[1.8]" />
              </div>
            </div>

            {/* Step list */}
            <div className="mt-5 space-y-5">
              {MILESTONES.map((step, idx) => {
                const isPassed = step.statuses.includes(order.status);
                const isCurrent =
                  isPassed &&
                  (idx === MILESTONES.length - 1 ||
                    !MILESTONES[idx + 1].statuses.includes(order.status));

                const Icon = step.icon;

                return (
                  <div key={step.id} className="relative flex gap-3.5">
                    {/* Vertical Connector Line */}
                    {idx !== MILESTONES.length - 1 && (
                      <div
                        className={`absolute left-3.5 top-8 -bottom-5 w-0.5 transition-colors ${
                          isPassed && !isCurrent ? "bg-zinc-900" : "bg-zinc-200"
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all ${
                        isCurrent
                          ? "border-zinc-900 bg-zinc-900 text-white ring-4 ring-zinc-100"
                          : isPassed
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-zinc-50 text-zinc-400"
                      }`}
                    >
                      {isCurrent ? (
                        <CircleDot className="h-3.5 w-3.5 animate-spin text-white" strokeWidth={2} />
                      ) : isPassed ? (
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                      ) : (
                        <Icon className="h-3 w-3" strokeWidth={1.8} />
                      )}
                    </div>

                    {/* Step Text Info */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-xs font-bold leading-tight ${
                            isPassed ? "text-zinc-900" : "text-zinc-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <span className="rounded-md bg-zinc-900 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-zinc-500">
                        {step.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer metadata info */}
            <div className="mt-6 flex items-center gap-2 border-t border-zinc-100 pt-3.5 text-xs text-zinc-500">
              <Clock className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.8} />
              <span>Telemetry updates every 15 minutes</span>
            </div>
          </div>

          {/* Kilometer & Route Metrics Card */}
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800">
                  <Navigation className="h-4.5 w-4.5 stroke-2 text-zinc-700" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Total Corridor Distance
                  </span>
                  <p className="text-lg font-extrabold tracking-tight text-zinc-900">
                    674.2 km
                  </p>
                </div>
              </div>

              <div className="h-8 w-px bg-zinc-200/80" />

              <div className="text-right">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Transit Status
                </span>
                <div className="inline-flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-emerald-700">
                    On Schedule
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}