import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleDot,
  Home,
  MapPin,
  Package,
  Phone,
  Radio,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { OrderRepository } from "@africasuk/database";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import TrackingMapClient from "@/components/tracking/TrackingMapClient";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

const WHATSAPP_NUMBER = "211923866290";

const MILESTONES = [
  {
    id: "nairobi",
    label: "Dispatched",
    fullLabel: "Dispatched from Nairobi",
    description: "Order sourcing and dispatch",
    location: "Nairobi, Kenya",
    icon: Building2,
    statuses: [
      "PENDING",
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
    label: "In Transit",
    fullLabel: "Cross-Border Transit",
    description: "Shipment travelling towards South Sudan",
    location: "Kenya – Uganda – South Sudan",
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
    label: "Customs",
    fullLabel: "Customs & Nimule Clearance",
    description: "Cross-border inspection point",
    location: "Nimule, South Sudan",
    icon: ShieldCheck,
    statuses: [
      "AT_BORDER",
      "AT_JUBA_WAREHOUSE",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ],
  },
  {
    id: "juba",
    label: "Juba Hub",
    fullLabel: "Arrived in Juba",
    description: "Receiving and order preparation",
    location: "Juba, South Sudan",
    icon: Building2,
    statuses: [
      "AT_JUBA_WAREHOUSE",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ],
  },
  {
    id: "delivery",
    label: "Delivered",
    fullLabel: "Final Destination",
    description: "Customer delivery handover",
    location: "Customer destination",
    icon: Home,
    statuses: ["DELIVERED"],
  },
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Awaiting Confirmation",
  CONFIRMED: "Order Confirmed",
  PROCESSING: "Being Processed",
  READY_FOR_PICKUP: "Ready for Dispatch",
  IN_TRANSIT: "In Transit",
  AT_BORDER: "Customs Clearance",
  AT_JUBA_WAREHOUSE: "Arrived in Juba",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered Successfully",
};

function getCurrentMilestone(status: string) {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (MILESTONES[i].statuses.includes(status)) return i;
  }
  return 0;
}

/* -------------------------------------------------------
   PROGRESS
------------------------------------------------------- */

function ShipmentProgress({
  currentIndex,
  isDelivered,
}: {
  currentIndex: number;
  isDelivered: boolean;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-bold text-zinc-950 sm:text-sm">
          Shipment progress
        </h2>
        <span className="text-[9px] text-zinc-500 sm:text-xs">
          {isDelivered ? "5 of 5 completed" : `${currentIndex + 1} of 5 stages`}
        </span>
      </div>

      <div className="grid grid-cols-5">
        {MILESTONES.map((step, index) => {
          const passed = index < currentIndex || isDelivered;
          const active = index === currentIndex && !isDelivered;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              {index > 0 && (
                <div
                  className={`absolute right-1/2 top-3.5 h-0.5 w-full ${
                    passed || active ? "bg-emerald-600" : "bg-zinc-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border sm:h-9 sm:w-9 ${
                  passed
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : active
                      ? "border-emerald-600 bg-white text-emerald-700"
                      : "border-zinc-200 bg-white text-zinc-400"
                }`}
              >
                {passed ? (
                  <Check size={13} strokeWidth={2.5} />
                ) : (
                  <Icon size={13} />
                )}
              </div>

              <span
                className={`mt-1.5 text-center text-[8px] font-semibold sm:text-[10px] ${
                  active || passed ? "text-zinc-900" : "text-zinc-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   ROUTE
------------------------------------------------------- */

function RouteCard() {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm sm:p-3">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 sm:h-10 sm:w-10">
          <MapPin size={18} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold text-zinc-950 sm:text-xs">
            Nairobi, Kenya
          </p>
          <p className="text-[8px] text-zinc-400">Origin</p>
        </div>
      </div>

      <div className="flex min-w-8.75 flex-1 items-center justify-center text-emerald-700">
        <div className="h-px flex-1 border-t border-dashed border-emerald-500" />
        <ArrowRight size={16} className="mx-1 shrink-0" />
        <div className="h-px flex-1 border-t border-dashed border-emerald-500" />
      </div>

      <div className="flex min-w-0 items-center gap-2">
        <div className="min-w-0 text-right">
          <p className="truncate text-[10px] font-bold text-zinc-950 sm:text-xs">
            Juba, South Sudan
          </p>
          <p className="text-[8px] text-zinc-400">Destination</p>
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 sm:h-10 sm:w-10">
          <MapPin size={18} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   CURRENT STAGE
------------------------------------------------------- */

function CurrentStage({
  currentStep,
  isDelivered,
}: {
  currentStep: (typeof MILESTONES)[number];
  isDelivered: boolean;
}) {
  const Icon = currentStep.icon;

  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2.5 shadow-sm sm:p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 sm:h-11 sm:w-11">
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-semibold uppercase tracking-wide text-zinc-400">
          {isDelivered ? "Completed journey" : "Current stage"}
        </p>
        <p className="mt-0.5 truncate text-[11px] font-bold text-zinc-950 sm:text-sm">
          {currentStep.fullLabel}
        </p>
        <p className="truncate text-[9px] text-zinc-500 sm:text-[10px]">
          {currentStep.description}
        </p>
      </div>

      <MapPin size={16} className="shrink-0 text-emerald-600" />
    </div>
  );
}

/* -------------------------------------------------------
   DELIVERY PREVIEW
------------------------------------------------------- */

function DeliveryPreview() {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white p-2 shadow-sm sm:gap-3 sm:p-3">
      <div className="relative h-13.5 w-18 shrink-0 overflow-hidden rounded-lg bg-zinc-100 sm:h-17 sm:w-22.5">
        <Image
          src="/images/tracking/delivery-handover.jpg"
          alt="Order delivery handover"
          fill
          sizes="90px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[8px] font-bold uppercase tracking-wide text-emerald-700 sm:text-[9px]">
          Delivery service
        </p>
        <p className="mt-0.5 text-[10px] font-bold leading-tight text-zinc-950 sm:text-xs">
          Your order, delivered with care.
        </p>
        <p className="mt-0.5 text-[8px] text-zinc-500 sm:text-[9px]">
          Follow your shipment until it reaches you.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   SUPPORT
------------------------------------------------------- */

function SupportContact() {
  return (
    <div className="rounded-xl bg-white px-3 py-2 shadow-sm sm:p-3">
      <div className="flex items-center gap-2.5">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-100 sm:h-11 sm:w-11">
          <Image
            src="/images/support/support-agent.jpg"
            alt="Africa Suk support agent"
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="truncate text-[10px] font-bold text-zinc-950 sm:text-xs">
              Africa Suk Support
            </p>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          </div>
          <p className="text-[8px] text-zinc-500 sm:text-[9px]">
            Delivery assistance
          </p>
          <p className="text-[9px] font-semibold text-zinc-900 sm:text-[10px]">
            +211 923 866 290
          </p>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Africa Suk Support"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-white transition hover:bg-zinc-800 active:scale-95 sm:h-10 sm:w-10"
        >
          <Phone size={15} />
        </a>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   DESKTOP JOURNEY
------------------------------------------------------- */

function ShipmentJourney({
  currentIndex,
  isDelivered,
}: {
  currentIndex: number;
  isDelivered: boolean;
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="text-sm font-bold text-zinc-950">
        Shipment journey
      </h2>
      <p className="mt-1 text-[10px] text-zinc-500">
        Follow your order through every stage.
      </p>

      <div className="mt-4">
        {MILESTONES.map((step, index) => {
          const passed = index < currentIndex || isDelivered;
          const active = index === currentIndex && !isDelivered;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex gap-3 pb-4 last:pb-0">
              {index !== MILESTONES.length - 1 && (
                <div
                  className={`absolute left-4 top-8 h-[calc(100%-8px)] w-px ${
                    passed ? "bg-emerald-500" : "bg-zinc-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                  passed
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : active
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                      : "border-zinc-200 bg-white text-zinc-400"
                }`}
              >
                {passed ? <Check size={14} /> : <Icon size={14} />}
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <p className="text-[11px] font-semibold text-zinc-950">
                  {step.fullLabel}
                </p>
                <p className="mt-0.5 text-[9px] text-zinc-500">
                  {step.description}
                </p>
                <p className="mt-0.5 text-[9px] text-zinc-400">
                  {step.location}
                </p>
                {active && (
                  <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-semibold text-emerald-700">
                    Current stage
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   PAGE
------------------------------------------------------- */

export default async function TrackOrderPage({ params }: Props) {
  const { orderNumber } = await params;

  const supabase = await createServerSupabaseClient();
  const repository = new OrderRepository(supabase);
  const order = await repository.findByOrderNumber(orderNumber);

  if (!order) notFound();

  const status = order.status;
  const currentIndex = getCurrentMilestone(status);
  const isDelivered = status === "DELIVERED";
  const currentStep = MILESTONES[currentIndex];

  return (
    <main className="h-dvh w-full overflow-hidden bg-[#00764f] text-zinc-950 antialiased">

      {/* MOBILE */}
      <div className="flex h-full min-h-0 flex-col lg:hidden">

        {/* MAP — RESTORED TO A LARGER SIZE */}
        <section className="relative h-[39dvh] min-h-57.5 max-h-85nk-0 overflow-hidden rounded-b-[24px] bg-[#edf3ee] shadow-md">
          <div className="absolute inset-0 [&_.leaflet-container]:h-full! [&_.leaflet-container]:w-full! [&>div]:h-full!">
            <TrackingMapClient status={status} />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-500 flex items-center justify-between gap-2 p-3">
            <Link
              href={`/account/orders/${order.orderNumber}`}
              className="pointer-events-auto flex h-9 items-center gap-1.5 rounded-full border border-zinc-200/70 bg-white/95 px-3 text-[10px] font-semibold text-zinc-800 shadow-md"
            >
              <ArrowLeft size={13} />
              Back to order
            </Link>

            <div className="pointer-events-auto flex h-9 items-center gap-1.5 rounded-full border border-emerald-100 bg-white/95 px-3 text-[9px] font-semibold text-emerald-800 shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Shipment tracking
            </div>
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col justify-evenly gap-1.5 overflow-hidden bg-[#00764f] px-3 py-1.5">

  <div className="flex shrink-0 justify-center">
    <div className="h-1 w-9 rounded-full bg-white/90" />
  </div>

  {/* ORDER */}
  <div className="flex shrink-0 items-center justify-between gap-2 px-1 text-white">
    <div className="min-w-0">
      <p className="text-[8px] text-white/70">ORDER NUMBER</p>
      <h1 className="truncate text-sm font-bold">
        #{order.orderNumber}
      </h1>
    </div>

    <div className="text-right">
      <p className="text-[8px] text-white/70">Current status</p>
      <span className="mt-0.5 inline-flex max-w-37.5 items-center gap-1 rounded-full bg-white px-2 py-1 text-[8px] font-bold text-emerald-800">
        <CircleDot size={10} />
        <span className="truncate">{STATUS_LABELS[status] ?? status}</span>
      </span>
    </div>
  </div>

  {/* ROUTE */}
  <div className="shrink-0">
    <RouteCard />
  </div>

  {/* PROGRESS */}
  <div className="shrink-0 rounded-xl bg-white px-3 py-2.5 shadow-sm">
    <ShipmentProgress
      currentIndex={currentIndex}
      isDelivered={isDelivered}
    />
  </div>

  {/* CURRENT STAGE */}
  <div className="shrink-0">
    <CurrentStage
      currentStep={currentStep}
      isDelivered={isDelivered}
    />
  </div>

  {/* DELIVERY */}
  <div className="shrink-0">
    <DeliveryPreview />
  </div>

  {/* SUPPORT */}
  <div className="shrink-0">
    <SupportContact />
  </div>

  <p className="shrink-0 text-center text-[7px] text-white/60">
    Africa Suk · Shop with Confidence
  </p>
</section>
      </div>

      {/* DESKTOP */}
      <div className="hidden h-full min-h-0 grid-cols-[minmax(0,1fr)_390px] lg:grid">

        <section className="relative min-h-0 overflow-hidden bg-[#edf3ee]">
          <div className="absolute inset-0 [&_.leaflet-container]:h-full! [&_.leaflet-container]:w-full! [&>div]:h-full!">
            <TrackingMapClient status={status} />
          </div>

          <Link
            href={`/account/orders/${order.orderNumber}`}
            className="absolute left-5 top-5 z-500 flex items-center gap-2 rounded-full border border-zinc-200 bg-white/95 px-4 py-2.5 text-xs font-semibold text-zinc-800 shadow-lg"
          >
            <ArrowLeft size={15} />
            Back to order
          </Link>

          <div className="absolute right-5 top-5 z-500 flex items-center gap-2 rounded-full border border-emerald-100 bg-white/95 px-4 py-2.5 text-xs font-semibold text-emerald-800 shadow-lg">
            <Radio size={14} />
            Shipment tracking
          </div>
        </section>

        <aside className="flex min-h-0 flex-col gap-3 overflow-hidden bg-[#00764f] p-4 xl:p-5">

          <div className="flex shrink-0 items-center justify-between px-1 text-white">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">
                AFRICA SUK
              </p>
              <h1 className="mt-1 text-lg font-bold">Track shipment</h1>
              <p className="mt-0.5 text-[10px] text-white/70">
                Order #{order.orderNumber}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-800">
              <Package size={18} />
            </div>
          </div>

          <RouteCard />

          <div className="shrink-0 rounded-xl bg-white px-3 py-2.5 shadow-sm">
            <p className="text-[9px] font-semibold text-zinc-400">
              CURRENT STATUS
            </p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs font-bold text-emerald-800">
                {STATUS_LABELS[status] ?? status}
              </p>
              <Radio size={17} className="text-emerald-700" />
            </div>
          </div>

          <div className="shrink-0 rounded-xl bg-white p-3 shadow-sm">
            <ShipmentProgress
              currentIndex={currentIndex}
              isDelivered={isDelivered}
            />
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <ShipmentJourney
              currentIndex={currentIndex}
              isDelivered={isDelivered}
            />
          </div>

          <DeliveryPreview />
          <SupportContact />

          <p className="shrink-0 text-center text-[8px] text-white/60">
            Africa Suk · Shop with Confidence
          </p>
        </aside>
      </div>
    </main>
  );
}