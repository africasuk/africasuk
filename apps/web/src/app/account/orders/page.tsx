import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  Package, 
  ChevronRight, 
  Clock, 
  MapPin, 
  ShoppingBag, 
  ExternalLink 
} from "lucide-react";

import { getMyOrders } from "@/actions/orders";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/auth/server";
import { Price } from "@/components/currency/Price";
import { Order } from "@africasuk/types";

// Helper to format raw enum status into user-friendly text
function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Helper to generate dynamic status badge styles
function getStatusBadgeStyle(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return "bg-emerald-50 text-[#005c2e] border-emerald-200/80";
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
    case "AT_BORDER":
      return "bg-amber-50 text-amber-700 border-amber-200/80";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200/80";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200/80";
  }
}

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account/orders");
  }

  const orders = await getMyOrders();

  return (
    <Layout>
      <section className="min-h-screen bg-gray-50/50 py-10 antialiased select-none">
        <Container>
          <div className="mx-auto max-w-5xl">
            
            {/* Header Block */}
            <div className="mb-8 rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#002b15] to-[#005c2e] text-white shadow-md shadow-[#002b15]/15">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#002b15]">
                    My Orders
                  </h1>
                  <p className="mt-0.5 text-xs sm:text-sm font-medium text-gray-500">
                    Track live logistics telemetry and review past purchases.
                  </p>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {orders.length === 0 ? (
              <div className="rounded-3xl border border-gray-200/80 bg-white p-12 text-center shadow-xs">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#005c2e] mb-4">
                  <ShoppingBag className="h-8 w-8 stroke-[1.8]" />
                </div>
                <h2 className="text-lg font-black uppercase tracking-wide text-[#002b15]">
                  No orders found
                </h2>
                <p className="mt-1 text-xs font-medium text-gray-500 max-w-sm mx-auto">
                  When you place an order across our regional network, your telemetry feed will appear here.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#002b15] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-[#004220] transition-all active:scale-98"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              /* Orders Feed */
              <div className="space-y-4">
                {orders.map((orderItem) => {
                const order = orderItem as Order & { image?: string | null };
                const statusText = formatStatus(order.status);
                const badgeStyle = getStatusBadgeStyle(order.status);

                return (
                  <div
                    key={order.id}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6 shadow-xs hover:border-[#005c2e]/40 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      
                      {/* Order Image & Metadata */}
                      <div className="flex items-center gap-4">
                        {order.image ? (
                          <Image
                            src={order.image}
                            alt={`Order #${order.orderNumber}`}
                            width={72}
                            height={72}
                            className="h-18 w-18 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-18 w-18 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-sm sm:text-base font-black tracking-tight text-[#002b15]">
                              Order #{order.orderNumber}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${badgeStyle}`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-current" />
                              {statusText}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-gray-400" />
                              {new Date(order.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-[#005c2e]" />
                              Corridor Route
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Navigation Actions */}
                      <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3 sm:border-t-0 sm:pt-0 sm:justify-end">
                        <div className="text-left sm:text-right">
                          <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
                            Total Amount
                          </span>
                          <div className="text-base sm:text-lg font-black text-[#002b15]">
                            <Price price={order.total} />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/track/${order.orderNumber}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200/80 bg-emerald-50/60 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-[#005c2e] hover:bg-emerald-100/80 transition-colors"
                          >
                            <span>Track Live</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>

                          <Link
                            href={`/account/orders/${order.orderNumber}`}
                            aria-label="View order details"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-[#002b15] hover:text-white transition-all duration-200 active:scale-95"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
              </div>
            )}
            
          </div>
        </Container>
      </section>
    </Layout>
  );
}