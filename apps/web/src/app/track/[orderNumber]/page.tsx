import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ChevronLeft,
  Clock,
  MapPin,
  PackageCheck,
  Truck,
  Globe2,
  Radio,
} from "lucide-react";

import { OrderRepository } from "@africasuk/database";

import TrackingMap from "@/components/tracking/TrackingMap";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

// Helper to format raw enum status into user-friendly text
function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function TrackOrderPage({ params }: Props) {
  const { orderNumber } = await params;

  const supabase = await createServerSupabaseClient();
  const repository = new OrderRepository(supabase);

  const order = await repository.findByOrderNumber(orderNumber);

  if (!order) {
    notFound();
  }

  const formattedStatus = formatStatus(order.status);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 antialiased select-none">
      
      {/* Top Bar Navigation & Order ID */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/account/orders/${order.orderNumber}`}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-[#002b15] shadow-2xs hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-98 cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Order</span>
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/60 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#005c2e]">
          <Truck className="h-4 w-4" />
          <span>Order #{order.orderNumber}</span>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="mb-8 rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          
          {/* Status Title Block */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#002b15] to-[#005c2e] text-white shadow-md shadow-[#002b15]/20">
              <PackageCheck className="h-6 w-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#002b15]">
                  Track Order
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#005c2e] border border-emerald-100">
                  <Radio className="h-3 w-3 animate-pulse text-emerald-600" />
                  <span>Live Telemetry</span>
                </span>
              </div>

              <p className="mt-1 text-xs sm:text-sm font-medium text-gray-500">
                Real-time route tracking across regional logistics corridors.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 md:border-t-0 md:pt-0">
            <div className="rounded-2xl bg-gray-50/80 border border-gray-200/60 px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400">
                <Clock className="h-3.5 w-3.5 text-[#005c2e]" />
                Current Status
              </span>
              <p className="mt-0.5 text-xs font-extrabold uppercase tracking-wide text-[#002b15]">
                {formattedStatus}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50/80 border border-gray-200/60 px-4 py-2.5">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400">
                <MapPin className="h-3.5 w-3.5 text-[#005c2e]" />
                Corridor
              </span>
              <p className="mt-0.5 text-xs font-extrabold uppercase tracking-wide text-[#002b15]">
                Uganda → South Sudan
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Interactive Map Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-[#005c2e]" />
            <h2 className="text-xs font-black uppercase tracking-widest text-[#002b15]">
              Live Route Overview
            </h2>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
            Auto-Sync Active
          </span>
        </div>

        <TrackingMap status={order.status} />
      </div>
    </main>
  );
}