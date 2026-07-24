import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, ArrowRight, MapPin, CreditCard, Clock } from "lucide-react";

import { getOrder } from "@/actions/orders";
import { createClient } from "@/lib/auth/server";

import Container from "@/components/layout/Container";
import Layout from "@/components/layout/Layout";
import { Price } from "@/components/currency/Price";
import type { ProductWithDetails } from "@africasuk/types";

interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

export default async function OrderDetailsPage({
  params,
}: Props) {
  const { orderNumber } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?redirect=/account/orders/${orderNumber}`,
    );
  }

  const result = await getOrder(orderNumber);

  if (!result) {
    notFound();
  }

  const { order, items } = result;

  return (
    <Layout>
      <section className="min-h-screen bg-gray-50/60 py-10 antialiased select-none">
        <Container>
          <div className="mx-auto max-w-5xl space-y-6">
            
            {/* Header Module */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#005c2e] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      Verified Purchase
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#002b15]">
                    Order #{order.orderNumber}
                  </h1>

                  <p className="mt-1 text-xs sm:text-sm font-medium text-gray-500">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div className="text-left md:text-right space-y-1">
                    <div className="flex items-center gap-2 md:justify-end">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status:</span>
                      <span className="text-xs font-black uppercase tracking-wide text-[#002b15] bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 md:justify-end">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Payment:</span>
                      <span className="text-xs font-black uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/track/${order.orderNumber}`}
                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#002b15] to-[#005c2e] px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-md shadow-[#002b15]/10 hover:opacity-95 active:scale-98 transition-all duration-300"
                  >
                    <span>Track Order</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Address and Financial Totals Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              
              {/* Delivery Address Card */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-[#005c2e]" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-[#002b15]">
                      Delivery Address
                    </h2>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 font-medium leading-relaxed">
                    <p className="font-bold text-gray-900 text-base mb-1">
                      {order.customerName}
                    </p>
                    <p>{order.address}</p>
                    <p>
                      {order.city}
                      {order.state ? `, ${order.state}` : ""}
                    </p>
                    <p className="uppercase font-semibold text-xs tracking-wider text-gray-500">
                      {order.country}
                    </p>

                    {order.postalCode && (
                      <p className="text-xs text-gray-400">{order.postalCode}</p>
                    )}
                  </div>
                </div>

                {order.customerPhone && (
                  <div className="mt-6 border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500">
                    Phone: <span className="text-gray-900">{order.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Payment Summary Card */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4 text-[#005c2e]" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-[#002b15]">
                    Payment Summary
                  </h2>
                </div>

                <div className="space-y-3 text-xs sm:text-sm font-medium text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <div className="font-semibold text-gray-900">
                      <Price price={order.subtotal} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Shipping Fee</span>
                    <div className="font-semibold text-gray-900">
                      <Price price={order.shipping} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Tax</span>
                    <div className="font-semibold text-gray-900">
                      <Price price={order.tax} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-sm sm:text-base font-black text-[#002b15]">
                    <span className="uppercase tracking-wider text-xs">Total Charged</span>
                    <div>
                      <Price price={order.total} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Method</span>
                    <span className="text-xs font-extrabold uppercase tracking-wide text-[#002b15] bg-gray-100 px-3 py-1 rounded-full">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Estimation Card */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="h-4 w-4 text-[#005c2e]" />
                <h2 className="text-xs font-black uppercase tracking-widest text-[#002b15]">
                  Estimated Arrival
                </h2>
              </div>

              {order.estimatedDeliveryStart && order.estimatedDeliveryEnd ? (
                <>
                  <p className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#002b15]">
                    {format(new Date(order.estimatedDeliveryStart), "dd MMM yyyy")}
                    {" "}—{" "}
                    {format(new Date(order.estimatedDeliveryEnd), "dd MMM yyyy")}
                  </p>

                  <p className="mt-2 text-xs text-gray-500 font-medium max-w-xl leading-relaxed">
                    Delivery estimates may change depending on supplier availability,
                    customs clearance, and local transit schedules.
                  </p>

                  {order.estimatedDeliveryUpdatedAt && (
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      <span>
                        Updated{" "}
                        {format(new Date(order.estimatedDeliveryUpdatedAt), "dd MMM yyyy")}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Awaiting fulfillment confirmation.</span>
                </div>
              )}
            </div>

            {/* Rich Dynamic Order Items Block */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Package className="h-4 w-4 text-[#005c2e]" />
                <h2 className="text-xs font-black uppercase tracking-widest text-[#002b15]">
                  Order Items ({items.length})
                </h2>
              </div>

              <div className="space-y-6">
                {items.map(({ item, product, variant }) => {
                  const detailedProduct = product as ProductWithDetails;
                  const image = item.image ?? null;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                    >
                      {/* Image Preview Container */}
                      <div className="relative h-24 w-24 shrink-0 rounded-2xl overflow-hidden border border-gray-200/80 bg-gray-50 shadow-xs">
                        {image ? (
                          <Image
                            src={image}
                            alt={product?.name ?? item.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Info & Metadata */}
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div>
                          <h3 className="text-base font-extrabold text-[#002b15]">
                            {product?.name ?? item.name}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                            {detailedProduct?.brand && (
                              <span className="font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                                {detailedProduct.brand.name}
                              </span>
                            )}

                            {detailedProduct?.category && (
                              <span className="font-extrabold uppercase tracking-wider text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md text-[10px]">
                                {detailedProduct.category.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {variant && variant.optionName && (
                          <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-0.5">
                            <span className="rounded-full bg-gray-100 border border-gray-200/60 px-3 py-1 text-[11px] font-medium text-gray-700">
                              <strong className="text-gray-900">{variant.optionName}</strong>: {variant.optionValue}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-4 text-xs font-semibold text-gray-500 justify-center sm:justify-start pt-1">
                          <span>Qty: <strong className="text-gray-900">{item.quantity}</strong></span>
                          <span>•</span>
                          <span>
                            Unit: <Price price={item.price} />
                          </span>
                        </div>
                      </div>

                      {/* Line Item Total Price */}
                      <div className="text-center sm:text-right min-w-28">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Item Total</span>
                        <div className="text-lg font-black text-[#002b15]">
                          <Price price={item.price * item.quantity} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </Container>
      </section>
    </Layout>
  );
}