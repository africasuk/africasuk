
import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";

import { getOrder } from "@/actions/orders";
import { createClient } from "@/lib/auth/server";

import { ExchangeRateRepository } from "@africasuk/database";
import { ExchangeRateService } from "@africasuk/api";

import Container from "@/components/layout/Container";
import Layout from "@/components/layout/Layout";
import { Price } from "@/components/currency/Price";
import type { ProductWithDetails } from "@africasuk/types";
import { ReviewForm } from "@/components/products/ReviewForm";
import { SendReceiptButton } from "@/components/orders/SendReceiptButton";
import { PrintReceiptButton } from "@/components/orders/PrintReceiptButton";
import { PrintableReceipt } from "@/components/orders/PrintableReceipt";

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

  const isDelivered = order.status?.toUpperCase() === "DELIVERED";
  const isCancelled = order.status?.toUpperCase() === "CANCELLED";
  const isPickup = order.fulfillmentMethod === "PICKUP";
  const isDelivery = order.fulfillmentMethod === "DELIVERY";
  const firstEntry = items[0];

  const exchangeRateService = new ExchangeRateService(
    new ExchangeRateRepository(supabase),
  );

  const currentRate = await exchangeRateService.getCurrent();

  if (!currentRate?.rate) {
    throw new Error("Current exchange rate is not available.");
  }

  const exchangeRate = currentRate.rate;

  const buttonClass =
    "inline-flex min-h-10 items-center justify-center border border-black px-4 py-2 text-xs font-semibold text-black transition hover:bg-black hover:text-white";

  return (
    <Layout>
      <PrintableReceipt
        order={order}
        items={items}
        exchangeRate={exchangeRate}
      />

      {/* Extra top spacing prevents the fixed header from covering the page */}
      <main className="min-h-screen bg-white pt-28 pb-32 text-black antialiased sm:py-8">
        <Container className="mx-auto max-w-5xl px-4 sm:px-6">

          {/* Breadcrumbs */}
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-zinc-500">
            <Link href="/account" className="hover:text-black hover:underline">
              Your Account
            </Link>

            <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />

            <Link
              href="/account/orders"
              className="hover:text-black hover:underline"
            >
              Your Orders
            </Link>

            <ChevronRight className="h-3 w-3 shrink-0 text-zinc-400" />

            <span className="font-medium text-black">
              Order #{order.orderNumber}
            </span>
          </nav>

          {/* Heading */}
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                Order Details
              </h1>

              <p className="text-xs leading-relaxed text-zinc-500">
                Ordered on {format(new Date(order.createdAt), "MMMM d, yyyy")}
                {" "}• Order #{order.orderNumber}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <PrintReceiptButton />
              <SendReceiptButton orderNumber={order.orderNumber} />
            </div>
          </div>

          {/* Order Information */}
          <section className="border-b border-zinc-200 py-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-6 text-xs sm:grid-cols-3 lg:grid-cols-5">

              {/* Address */}
              <div className="min-w-0">
                <p className="mb-1.5 text-zinc-500">Shipping Address</p>

                <p className="font-semibold text-black">
                  {order.customerName}
                </p>

                <p className="mt-1 wrap-break-wordword leading-relaxed text-zinc-600">
                  {order.address}, {order.city}
                </p>
              </div>

              {/* Payment */}
              <div className="min-w-0">
                <p className="mb-1.5 text-zinc-500">Payment Method</p>

                <p className="wrap-break-word font-semibold uppercase text-black">
                  {order.paymentMethod || "Cash on Delivery"}
                </p>

                <p className="mt-1 text-zinc-500">
                  Status: {order.paymentStatus}
                </p>
              </div>

              {/* Fulfillment */}
              <div className="min-w-0">
                <p className="mb-2 text-zinc-500">Fulfillment Method</p>

                <span
                  className={`inline-flex max-w-full items-center rounded-full px-3 py-1.5 text-xs font-semibold leading-relaxed ${
                    isPickup
                      ? "bg-emerald-100 text-emerald-800"
                      : isDelivery
                        ? "bg-amber-100 text-amber-800"
                        : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {isPickup
                    ? "Pickup at agreed location"
                    : isDelivery
                      ? "Home Delivery"
                      : "Not specified"}
                </span>

                <p className="mt-2 font-semibold text-black">
                  {isPickup
                    ? "FREE"
                    : isDelivery
                      ? Number(order.shipping ?? 0) > 0
                        ? "Delivery fee applied"
                        : "Delivery fee pending"
                      : "Awaiting confirmation"}
                </p>
              </div>

              {/* Order Summary */}
              <div className="min-w-0">
                <p className="mb-1.5 text-zinc-500">Order Summary</p>

                <p className="leading-relaxed text-zinc-600">
                  Items: <Price price={order.subtotal} />
                </p>

                <p className="leading-relaxed text-zinc-600">
                  Shipping: <Price price={order.shipping} />
                </p>
              </div>

              {/* Grand Total */}
              <div className="col-span-2 flex items-center justify-between border-t border-zinc-100 pt-4 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
                <p className="text-xs text-zinc-500">Grand Total</p>

                <p className="text-lg font-extrabold text-black">
                  <Price price={order.total} />
                </p>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <div className="grid grid-cols-1 items-start gap-8 pt-6 lg:grid-cols-12 lg:gap-10">

            {/* Main Column */}
            <div className="min-w-0 space-y-6 lg:col-span-8">

              {/* Delivery Status */}
              <section className="border-b border-zinc-200 pb-5">
                <div className="flex items-start gap-2.5">
                  {isDelivered ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 stroke-[2.5] text-emerald-700" />
                  ) : (
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        isCancelled ? "bg-red-500" : "bg-emerald-600"
                      }`}
                    />
                  )}

                  <div className="min-w-0">
                    <h2 className="text-base font-bold leading-snug text-black sm:text-xl">
                      {isDelivered
                        ? "Delivered"
                        : isCancelled
                          ? "Order Cancelled"
                          : `Expected delivery: ${
                              order.estimatedDeliveryEnd
                                ? format(
                                    new Date(order.estimatedDeliveryEnd),
                                    "MMMM d, yyyy",
                                  )
                                : "Arriving soon"
                            }`}
                    </h2>

                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-600">
                      {isDelivered
                        ? "Package was safely handed directly to the customer."
                        : isCancelled
                          ? "This order has been cancelled."
                          : "Your package is tracked through Africa Suk regional logistics network."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Products */}
              <section className="divide-y divide-zinc-200">
                {items.map(({ item, product, variant }) => {
                  const detailedProduct = product as ProductWithDetails;
                  const image = item.image ?? null;

                  return (
                    <div key={item.id} className="py-5 first:pt-0">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                        {/* Image */}
                        <div className="relative h-24 w-24 shrink-0 bg-zinc-50">
                          {image ? (
                            <Image
                              src={image}
                              alt={product?.name ?? item.name}
                              fill
                              sizes="96px"
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] text-zinc-400">
                              No image
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1 space-y-1.5">
                          <h3 className="text-sm font-semibold leading-snug text-black sm:text-base">
                            {product?.name ?? item.name}
                          </h3>

                          {detailedProduct?.brand && (
                            <p className="text-xs text-zinc-500">
                              by{" "}
                              <span className="font-medium text-black">
                                {detailedProduct.brand.name}
                              </span>
                            </p>
                          )}

                          {variant?.optionValue && (
                            <p className="text-xs text-zinc-600">
                              {variant.optionName || "Color"}:{" "}
                              <span className="font-semibold text-black">
                                {variant.optionValue}
                              </span>
                            </p>
                          )}

                          <p className="text-xs text-zinc-500">
                            Quantity:{" "}
                            <span className="font-semibold text-black">
                              {item.quantity}
                            </span>
                          </p>

                          <p className="pt-1 text-sm font-bold text-black">
                            <Price price={item.price} />
                          </p>
                        </div>

                        {/* Buy Again */}
                        <div className="w-full sm:w-auto">
                          <Link
                            href={`/products/${product?.slug ?? item.productId}`}
                            className={`${buttonClass} w-full sm:w-auto`}
                          >
                            Buy it again
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>

              {/* Review */}
              {isDelivered && firstEntry && (
                <section className="border-t border-zinc-200 pt-6">
                  <h3 className="mb-3 text-sm font-bold text-black">
                    Write a Product Review
                  </h3>

                  <ReviewForm
                    productId={firstEntry.item.productId}
                    orderId={order.id}
                    orderItemId={firstEntry.item.id}
                    variantId={firstEntry.item.variantId}
                  />
                </section>
              )}
            </div>

            {/* Sidebar */}
            <aside className="min-w-0 space-y-6 lg:col-span-4">

              {/* Actions */}
              <div className="space-y-2.5">
                <Link
                  href={`/track/${order.orderNumber}`}
                  className="block w-full border border-black bg-black py-3 text-center text-xs font-bold tracking-wide text-white transition hover:bg-white hover:text-black"
                >
                  Track Package
                </Link>

                <Link
                  href="/account/orders"
                  className={`${buttonClass} w-full`}
                >
                  View All Orders
                </Link>
              </div>

              {/* Payment Summary */}
              <section className="space-y-3 border-t border-zinc-200 pt-4 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                  Payment Summary
                </h4>

                <div className="flex justify-between gap-3 text-zinc-600">
                  <span>Items:</span>
                  <span className="font-medium text-black">
                    <Price price={order.subtotal} />
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-zinc-600">
                  <span>Shipping:</span>
                  <span className="font-medium text-black">
                    <Price price={order.shipping} />
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-zinc-600">
                  <span>Tax:</span>
                  <span className="font-medium text-black">
                    <Price price={order.tax} />
                  </span>
                </div>

                <div className="flex justify-between gap-3 border-t border-zinc-200 pt-3 text-sm font-bold text-black">
                  <span>Order Total:</span>
                  <span>
                    <Price price={order.total} />
                  </span>
                </div>
              </section>

              {/* Help */}
              <section className="space-y-2 border-t border-zinc-200 pt-4 text-xs leading-relaxed text-zinc-500">
                <p className="font-bold text-black">
                  Need help with your order?
                </p>

                <p>
                  Visit our{" "}
                  <Link
                    href="/contact"
                    className="font-medium text-black underline underline-offset-2 hover:text-emerald-700"
                  >
                    Customer Support
                  </Link>{" "}
                  or review the{" "}
                  <Link
                    href="/refund-policy"
                    className="font-medium text-black underline underline-offset-2 hover:text-emerald-700"
                  >
                    Return Policy
                  </Link>
                  .
                </p>
              </section>
            </aside>
          </div>
        </Container>
      </main>
    </Layout>
  );
}
