
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  ChevronRight,
  Clock,
  MapPin,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import { getMyOrders } from "@/actions/orders";
import Layout from "@/components/layout/Layout";
import Container from "@/components/layout/Container";
import { createClient } from "@/lib/auth/server";
import { Price } from "@/components/currency/Price";
import { Order } from "@africasuk/types";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusBadgeStyle(status: string) {
  switch (status.toUpperCase()) {
    case "DELIVERED":
      return "border-emerald-200/80 bg-emerald-50 text-emerald-700";
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
    case "AT_BORDER":
      return "border-amber-200/80 bg-amber-50 text-amber-700";
    case "CANCELLED":
      return "border-rose-200/80 bg-rose-50 text-rose-700";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-700";
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
      <section className="min-h-screen select-none bg-zinc-50/50 pb-24 pt-20 antialiased sm:py-12">
        <Container>
          <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
            {/* Page header */}
            <div className="flex flex-col justify-between gap-3 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:gap-4 sm:p-8">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-900 text-white sm:h-12 sm:w-12">
                  <Package className="h-5 w-5 stroke-[1.8] sm:h-6 sm:w-6" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                    My Orders
                  </h1>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                    Review and track your current purchases and delivery status.
                  </p>
                </div>
              </div>

              {orders.length > 0 && (
                <div className="inline-flex items-center gap-1.5 self-start rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 sm:self-auto">
                  <span>{orders.length}</span>
                  <span className="font-normal text-zinc-500">
                    {orders.length === 1 ? "order placed" : "orders placed"}
                  </span>
                </div>
              )}
            </div>

            {/* Empty state */}
            {orders.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200/90 bg-white px-5 py-8 text-center shadow-xs sm:p-14">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-400 sm:mb-4 sm:h-14 sm:w-14">
                  <ShoppingBag className="h-6 w-6 stroke-[1.8] sm:h-7 sm:w-7" />
                </div>

                <h2 className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
                  No orders found
                </h2>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-zinc-500 sm:text-sm">
                  When you place an order across our network, your purchase
                  history and shipment tracking will appear here.
                </p>

                <Link
                  href="/products"
                  className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-900 px-5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 active:scale-[0.985] sm:mt-6 sm:h-11"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </Link>
              </div>
            ) : (
              /* Orders list */
              <div className="space-y-3 sm:space-y-3.5">
                {orders.map((orderItem) => {
                  const order = orderItem as Order & {
                    image?: string | null;
                  };

                  const statusText = formatStatus(order.status);
                  const badgeStyle = getStatusBadgeStyle(order.status);

                  return (
                    <div
                      key={order.id}
                      className="group relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-4 transition-all duration-150 hover:border-zinc-300 hover:shadow-xs sm:p-6"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
                        {/* Order image and details */}
                        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/80 sm:h-22 sm:w-22">
                            {order.image ? (
                              <Image
                                src={order.image}
                                alt={`Order #${order.orderNumber}`}
                                fill
                                sizes="88px"
                                className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-zinc-400">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold tracking-tight text-zinc-900 sm:text-base">
                                Order #{order.orderNumber}
                              </span>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${badgeStyle}`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {statusText}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.8} />
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>

                              <span className="text-zinc-300">•</span>

                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.8} />
                                Regional Delivery
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Total and details button */}
                        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-zinc-100 pt-3 md:justify-end md:border-t-0 md:pt-0">
                          <div className="text-left md:text-right">
                            <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                              Total
                            </span>
                            <div className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
                              <Price price={order.total} />
                            </div>
                          </div>

                          <Link
                            href={`/account/orders/${order.orderNumber}`}
                            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 sm:px-4"
                          >
                            <span>View Details</span>
                            <ChevronRight className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-900" strokeWidth={2} />
                          </Link>
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
