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
      <section className="min-h-screen bg-gray-50/60 py-10 antialiased select-none">
        <Container className="max-w-none w-full px-4 sm:px-6 lg:px-12">
          {/* Main 2-Column Responsive Layout for Large Screens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Main Order Header, Items & Shipping */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Header Module */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-[#005c2e] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        Verified Purchase
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#002b15]">
                      Order #{order.orderNumber}
                    </h1>

                    <p className="mt-1 text-xs sm:text-sm font-normal text-gray-500">
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
                        <span className="text-xs font-medium text-gray-400">
                          Status:
                        </span>
                        <span className="text-xs font-semibold text-[#002b15] bg-gray-100 px-2.5 py-0.5 rounded-full">
                          {order.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 md:justify-end">
                        <span className="text-xs font-medium text-gray-400">
                          Payment:
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/track/${order.orderNumber}`}
                      className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#002b15] to-[#005c2e] px-5 py-2.5 text-xs font-medium text-white shadow-md shadow-[#002b15]/10 hover:opacity-95 active:scale-98 transition-all duration-300"
                    >
                      <span>Track order</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Delivery Estimation Card */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-[#005c2e]" />
                  <h2 className="text-xs font-semibold text-[#002b15]">
                    Estimated Arrival
                  </h2>
                </div>

                {order.estimatedDeliveryStart && order.estimatedDeliveryEnd ? (
                  <>
                    <p className="text-xl sm:text-2xl font-semibold tracking-tight text-[#002b15]">
                      {format(new Date(order.estimatedDeliveryStart), "dd MMM yyyy")}{" "}
                      —{" "}
                      {format(new Date(order.estimatedDeliveryEnd), "dd MMM yyyy")}
                    </p>

                    <p className="mt-2 text-xs text-gray-500 font-normal max-w-2xl leading-relaxed">
                      Delivery estimates may change depending on supplier availability,
                      customs clearance, and local transit schedules.
                    </p>

                    {order.estimatedDeliveryUpdatedAt && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-400">
                        <Clock className="h-3 w-3" />
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
                  <div className="flex items-center gap-2 text-sm font-normal text-gray-500">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Awaiting fulfillment confirmation.</span>
                  </div>
                )}
              </div>

              {/* Order Items Block */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-4 w-4 text-[#005c2e]" />
                  <h2 className="text-xs font-semibold text-[#002b15]">
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
                        className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-6">
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
                              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Info & Metadata */}
                          <div className="flex-1 space-y-2 text-center sm:text-left">
                            <div>
                              <h3 className="text-base font-semibold text-[#002b15]">
                                {product?.name ?? item.name}
                              </h3>

                              <div className="mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                                {detailedProduct?.brand && (
                                  <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
                                    {detailedProduct.brand.name}
                                  </span>
                                )}

                                {detailedProduct?.category && (
                                  <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md text-xs">
                                    {detailedProduct.category.name}
                                  </span>
                                )}
                              </div>
                            </div>

                            {variant && variant.optionName && (
                              <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-0.5">
                                <span className="rounded-full bg-gray-100 border border-gray-200/60 px-3 py-1 text-xs font-normal text-gray-700">
                                  <span className="text-gray-900 font-medium">
                                    {variant.optionName}
                                  </span>
                                  : {variant.optionValue}
                                </span>
                              </div>
                            )}

                            <div className="flex gap-4 text-xs font-normal text-gray-500 justify-center sm:justify-start pt-1">
                              <span>
                                Qty:{" "}
                                <span className="text-gray-900 font-medium">
                                  {item.quantity}
                                </span>
                              </span>
                              <span>•</span>
                              <span>
                                Unit: <Price price={item.price} />
                              </span>
                            </div>
                          </div>

                          {/* Line Item Total Price */}
                          <div className="text-center sm:text-right min-w-28">
                            <span className="block text-xs font-medium text-gray-400">
                              Item Total
                            </span>
                            <div className="text-base font-semibold text-[#002b15]">
                              <Price price={item.price * item.quantity} />
                            </div>
                          </div>
                        </div>

                        {/* Review Form Section for Delivered Orders */}
                        {order.status === "DELIVERED" && (
                          <div className="mt-4 pt-4 border-t border-gray-100/80">
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

            {/* RIGHT COLUMN: Sticky Sidebar (Address & Payment Summary) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              
              {/* Delivery Address Card */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-[#005c2e]" />
                    <h2 className="text-xs font-semibold text-[#002b15]">
                      Delivery Address
                    </h2>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 font-normal leading-relaxed">
                    <p className="font-semibold text-gray-900 text-base mb-1">
                      {order.customerName}
                    </p>
                    <p>{order.address}</p>
                    <p>
                      {order.city}
                      {order.state ? `, ${order.state}` : ""}
                    </p>
                    <p className="font-medium text-xs tracking-wider text-gray-500">
                      {order.country}
                    </p>

                    {order.postalCode && (
                      <p className="text-xs text-gray-400">{order.postalCode}</p>
                    )}
                  </div>
                </div>

                {order.customerPhone && (
                  <div className="mt-6 border-t border-gray-100 pt-3 text-xs font-medium text-gray-500">
                    Phone:{" "}
                    <span className="text-gray-900">{order.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Payment Summary Card */}
              <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-4 w-4 text-[#005c2e]" />
                  <h2 className="text-xs font-semibold text-[#002b15]">
                    Payment Summary
                  </h2>
                </div>

                <div className="space-y-3 text-xs sm:text-sm font-normal text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <div className="font-semibold text-gray-900">
                      <Price price={order.subtotal} />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Shipping fee</span>
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

                  <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-sm sm:text-base font-semibold text-[#002b15]">
                    <span className="text-xs font-medium">
                      Total Charged
                    </span>
                    <div>
                      <Price price={order.total} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">
                      Method
                    </span>
                    <span className="text-xs font-semibold text-[#002b15] bg-gray-100 px-3 py-1 rounded-full">
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