
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
import type { Order } from "@africasuk/types";

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
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
    case "AT_BORDER":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "CANCELLED":
      return "border-rose-200 bg-rose-50 text-rose-700";

    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
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
      <main className="min-h-screen select-none bg-white pb-32 pt-28 text-black antialiased sm:py-12">
        <Container>
          <div className="mx-auto max-w-5xl">

            {/* Page Header */}
            <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-black bg-white text-black sm:h-12 sm:w-12">
                  <Package className="h-5 w-5 stroke-[1.8] sm:h-6 sm:w-6" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                    My Orders
                  </h1>

                  <p className="mt-1 text-xs leading-relaxed text-zinc-500 sm:text-sm">
                    Review and track your purchases and delivery status.
                  </p>
                </div>
              </div>

              {orders.length > 0 && (
                <div className="inline-flex items-center gap-2 self-start text-xs text-zinc-500 sm:self-center">
                  <span className="font-bold text-black">
                    {orders.length}
                  </span>

                  <span>
                    {orders.length === 1 ? "order placed" : "orders placed"}
                  </span>
                </div>
              )}
            </div>

            {/* Empty State */}
            {orders.length === 0 ? (
              <div className="py-16 text-center sm:py-24">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center border border-zinc-200 text-zinc-400">
                  <ShoppingBag className="h-7 w-7 stroke-[1.6]" />
                </div>

                <h2 className="text-lg font-bold tracking-tight text-black">
                  No orders found
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-zinc-500 sm:text-sm">
                  When you place an order, your purchase history and shipment
                  tracking will appear here.
                </p>

                <Link
                  href="/products"
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 border border-black bg-black px-5 text-xs font-semibold text-white transition hover:bg-white hover:text-black"
                >
                  Start Shopping
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              </div>
            ) : (
              /* Orders List */
              <div className="divide-y divide-zinc-200">
                {orders.map((orderItem) => {
                  const order = orderItem as Order & {
                    image?: string | null;
                  };

                  const statusText = formatStatus(order.status);
                  const badgeStyle = getStatusBadgeStyle(order.status);

                  return (
                    <article
                      key={order.id}
                      className="py-5 first:pt-6 sm:py-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">

                        {/* Order Image and Details */}
                        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-zinc-200 bg-zinc-50 sm:h-24 sm:w-24">
                            {order.image ? (
                              <Image
                                src={order.image}
                                alt={`Order #${order.orderNumber}`}
                                fill
                                sizes="96px"
                                className="object-contain p-1.5"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-zinc-400">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-sm font-bold tracking-tight text-black sm:text-base">
                                Order #{order.orderNumber}
                              </h2>

                              <span
                                className={`inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-semibold ${badgeStyle}`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {statusText}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.8} />

                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
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

                        {/* Total and Action */}
                        <div className="flex items-center justify-between gap-4 border-t border-zinc-100 pt-3 sm:shrink-0 sm:justify-end sm:border-0 sm:pt-0">
                          <div className="sm:text-right">
                            <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                              Order Total
                            </span>

                            <div className="text-base font-bold tracking-tight text-black sm:text-lg">
                              <Price price={order.total} />
                            </div>
                          </div>

                          <Link
                            href={`/account/orders/${order.orderNumber}`}
                            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 border border-black bg-white px-3 text-xs font-semibold text-black transition hover:bg-black hover:text-white sm:px-4"
                          >
                            View Details

                            <ChevronRight
                              className="h-4 w-4"
                              strokeWidth={2}
                            />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Continue Shopping */}
            {orders.length > 0 && (
              <div className="border-t border-zinc-200 pt-5">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 transition hover:text-black"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continue Shopping
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </Container>
      </main>
    </Layout>
  );
}
