import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  ArrowRight,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Phone,
} from "lucide-react";

import { getOrder } from "@/actions/orders";
import { createClient } from "@/lib/auth/server";

import Container from "@/components/layout/Container";
import Layout from "@/components/layout/Layout";
import { Price } from "@/components/currency/Price";
import type { ProductWithDetails } from "@africasuk/types";
import { ReviewForm } from "@/components/products/ReviewForm";

interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

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
      return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
    case "AT_BORDER":
      return "bg-amber-50 text-amber-700 border-amber-200/80";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200/80";
    default:
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }
}

export default async function OrderDetailsPage({ params }: Props) {
  const { orderNumber } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/account/orders/${orderNumber}`);
  }

  const result = await getOrder(orderNumber);

  if (!result) {
    notFound();
  }

  const { order, items } = result;

  return (
    <Layout>
      <section className="min-h-screen bg-zinc-50/50 py-8 select-none antialiased sm:py-12">
        <Container className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-12">
            
            {/* LEFT COLUMN: Main Order Header, Items & Delivery */}
            <div className="space-y-6 lg:col-span-8">
              
              {/* Header Module */}
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs sm:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3 stroke-2" />
                        Verified Purchase
                      </span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                      Order #{order.orderNumber}
                    </h1>

                    <p className="text-xs text-zinc-500 sm:text-sm">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-4 md:border-t-0 md:pt-0">
                    <div className="space-y-1.5 text-left md:text-right">
                      <div className="flex items-center gap-2 md:justify-end">
                        <span className="text-xs font-medium text-zinc-400">
                          Status:
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${getStatusBadgeStyle(
                            order.status
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {formatStatus(order.status)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 md:justify-end">
                        <span className="text-xs font-medium text-zinc-400">
                          Payment:
                        </span>
                        <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-700">
                          {formatStatus(order.paymentStatus)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/track/${order.orderNumber}`}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-900 px-4 text-xs font-semibold text-white transition-all active:scale-[0.985] hover:bg-zinc-800"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Delivery Estimation Card */}
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs sm:p-7">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                    <Truck className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Estimated Arrival
                  </h2>
                </div>

                {order.estimatedDeliveryStart && order.estimatedDeliveryEnd ? (
                  <>
                    <p className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
                      {format(new Date(order.estimatedDeliveryStart), "dd MMM yyyy")}{" "}
                      —{" "}
                      {format(new Date(order.estimatedDeliveryEnd), "dd MMM yyyy")}
                    </p>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-zinc-500">
                      Delivery schedules may vary slightly depending on regional customs clearance,
                      supplier dispatch windows, and local road transit.
                    </p>

                    {order.estimatedDeliveryUpdatedAt && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.8} />
                        <span>
                          Updated{" "}
                          {format(
                            new Date(order.estimatedDeliveryUpdatedAt),
                            "dd MMM yyyy"
                          )}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Awaiting warehouse dispatch confirmation</span>
                  </div>
                )}
              </div>

              {/* Order Items Block */}
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs sm:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                      <Package className="h-4 w-4" strokeWidth={1.8} />
                    </div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Items Ordered
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-zinc-500">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="space-y-6">
                  {items.map(({ item, product, variant }) => {
                    const detailedProduct = product as ProductWithDetails;
                    const image = item.image ?? null;

                    return (
                      <div
                        key={item.id}
                        className="border-b border-zinc-100 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                          {/* 1:1 Aspect Ratio Thumbnail */}
                          <div className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-150 bg-zinc-50/80">
                            {image ? (
                              <Image
                                src={image}
                                alt={product?.name ?? item.name}
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

                          {/* Item Details */}
                          <div className="min-w-0 flex-1 space-y-2">
                            <div>
                              <h3 className="text-sm font-bold tracking-tight text-zinc-900 sm:text-base">
                                {product?.name ?? item.name}
                              </h3>

                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                                {detailedProduct?.brand && (
                                  <span className="font-semibold text-zinc-800">
                                    {detailedProduct.brand.name}
                                  </span>
                                )}
                                {detailedProduct?.brand && detailedProduct?.category && (
                                  <span className="text-zinc-300">•</span>
                                )}
                                {detailedProduct?.category && (
                                  <span>{detailedProduct.category.name}</span>
                                )}
                              </div>
                            </div>

                            {/* Option Variant Badge */}
                            {variant && variant.optionValue && (
                              <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                                  {variant.optionName || "Size"}: {variant.optionValue}
                                </span>
                              </div>
                            )}

                            {/* Pricing & Units */}
                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                              <span>
                                Qty:{" "}
                                <span className="font-semibold text-zinc-900">
                                  {item.quantity}
                                </span>
                              </span>
                              <span className="text-zinc-300">•</span>
                              <span>
                                Unit: <Price price={item.price} />
                              </span>
                            </div>
                          </div>

                          {/* Line Item Total */}
                          <div className="text-left sm:text-right shrink-0">
                            <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                              Total
                            </span>
                            <div className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
                              <Price price={item.price * item.quantity} />
                            </div>
                          </div>
                        </div>

                        {/* Customer Review Form */}
                        {order.status === "DELIVERED" && (
                          <div className="mt-4 pt-4 border-t border-zinc-100">
                            <ReviewForm
                              productId={item.productId}
                              orderId={order.id}
                              orderItemId={item.id}
                              variantId={item.variantId}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Delivery & Payment Details */}
            <div className="space-y-6 lg:col-span-4 lg:sticky lg:top-24">
              
              {/* Delivery Address Card */}
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                    <MapPin className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Delivery Address
                  </h2>
                </div>

                <div className="space-y-1 text-xs leading-relaxed text-zinc-600">
                  <p className="text-sm font-bold text-zinc-900 mb-1.5">
                    {order.customerName}
                  </p>
                  <p>{order.address}</p>
                  <p>
                    {order.city}
                    {order.state ? `, ${order.state}` : ""}
                  </p>
                  <p className="font-semibold text-zinc-800">{order.country}</p>

                  {order.postalCode && (
                    <p className="text-zinc-400">{order.postalCode}</p>
                  )}
                </div>

                {order.customerPhone && (
                  <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.8} />
                    <span className="font-semibold text-zinc-900">{order.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Payment Summary Card */}
              <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                    <CreditCard className="h-4 w-4" strokeWidth={1.8} />
                  </div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Payment Summary
                  </h2>
                </div>

                <div className="space-y-2.5 text-xs text-zinc-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-zinc-900">
                      <Price price={order.subtotal} />
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Shipping fee</span>
                    <span className="font-semibold text-zinc-900">
                      <Price price={order.shipping} />
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Tax</span>
                    <span className="font-semibold text-zinc-900">
                      <Price price={order.tax} />
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-sm font-bold text-zinc-900">
                    <span>Total Charged</span>
                    <div className="text-base font-bold text-zinc-900">
                      <Price price={order.total} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                    <span className="text-zinc-400">Payment Method</span>
                    <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </Container>
      </section>
    </Layout>
  );
}