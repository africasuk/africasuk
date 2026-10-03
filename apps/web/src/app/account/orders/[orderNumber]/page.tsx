import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

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

  const isDelivered =
    order.status?.toUpperCase() === "DELIVERED";

  const firstEntry = items[0];

const exchangeRateService =
  new ExchangeRateService(
    new ExchangeRateRepository(supabase),
  );

const currentRate =
  await exchangeRateService.getCurrent();

if (!currentRate?.rate) {
  throw new Error(
    "Current exchange rate is not available.",
  );
}

const exchangeRate = currentRate.rate;

  return (
    <Layout>
      {/* ================================================================
          PRINTABLE 80MM RECEIPT
      ================================================================= */}

      <PrintableReceipt
        order={order}
        items={items}
        exchangeRate={exchangeRate}
      />

      {/* ================================================================
          ON-SCREEN ORDER DETAILS
      ================================================================= */}

      <div className="min-h-screen bg-white py-8 antialiased text-black">
        <Container className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-zinc-500">
            <Link
              href="/account"
              className="hover:text-black hover:underline"
            >
              Your Account
            </Link>

            <ChevronRight className="h-3 w-3 text-zinc-400" />

            <Link
              href="/account/orders"
              className="hover:text-black hover:underline"
            >
              Your Orders
            </Link>

            <ChevronRight className="h-3 w-3 text-zinc-400" />

            <span className="font-medium text-black">
              Order #{order.orderNumber}
            </span>
          </nav>

          {/* Page Heading */}
          <div className="flex flex-col pb-4 sm:flex-row sm:items-baseline sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                Order Details
              </h1>

              <p className="text-xs text-zinc-500">
                Ordered on{" "}
                {format(
                  new Date(order.createdAt),
                  "MMMM d, yyyy",
                )}{" "}
                • Order #{order.orderNumber}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
              <PrintReceiptButton />

              <SendReceiptButton
                orderNumber={order.orderNumber}
              />
            </div>
          </div>

          {/* ORDER META */}
          <div className="mb-8 border-b border-t border-zinc-200 py-3">
            <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
              <div>
                <span className="block text-zinc-500">
                  Shipping Address
                </span>

                <span className="mt-0.5 block font-semibold text-black">
                  {order.customerName}
                </span>

                <span className="block text-zinc-600">
                  {order.address}, {order.city}
                </span>
              </div>

              <div>
                <span className="block text-zinc-500">
                  Payment Method
                </span>

                <span className="mt-0.5 block font-semibold uppercase text-black">
                  {order.paymentMethod ||
                    "Cash on Delivery"}
                </span>

                <span className="block text-zinc-500">
                  Status: {order.paymentStatus}
                </span>
              </div>

              <div>
                <span className="block text-zinc-500">
                  Order Summary
                </span>

                <span className="block text-zinc-600">
                  Items:{" "}
                  <Price price={order.subtotal} />
                </span>

                <span className="block text-zinc-600">
                  Shipping:{" "}
                  <Price price={order.shipping} />
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="block text-zinc-500">
                  Grand Total
                </span>

                <span className="mt-0.5 block text-base font-extrabold text-black">
                  <Price price={order.total} />
                </span>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
            {/* MAIN COLUMN */}
            <div className="space-y-6 lg:col-span-8">
              {/* DELIVERY STATUS */}
              <div className="border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-2">
                  {isDelivered ? (
                    <CheckCircle2 className="h-5 w-5 stroke-[2.5] text-emerald-700" />
                  ) : (
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  )}

                  <h2 className="text-lg font-bold text-black sm:text-xl">
                    {isDelivered
                      ? "Delivered"
                      : order.status ===
                          "CANCELLED"
                        ? "Order Cancelled"
                        : `Expected delivery: ${
                            order.estimatedDeliveryEnd
                              ? format(
                                  new Date(
                                    order.estimatedDeliveryEnd,
                                  ),
                                  "MMMM d, yyyy",
                                )
                              : "Arriving soon"
                          }`}
                  </h2>
                </div>

                <p className="mt-1 pl-7 text-xs text-zinc-600">
                  {isDelivered
                    ? "Package was safely handed directly to the customer."
                    : "Your package is tracked through Africa Suk regional logistics network."}
                </p>
              </div>

              {/* ITEMS */}
              <div className="divide-y divide-zinc-200">
                {items.map(
                  ({
                    item,
                    product,
                    variant,
                  }) => {
                    const detailedProduct =
                      product as ProductWithDetails;

                    const image =
                      item.image ?? null;

                    return (
                      <div
                        key={item.id}
                        className="py-6 first:pt-0"
                      >
                        <div className="flex flex-col items-start gap-4 sm:flex-row">
                          {/* Product Image */}
                          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center bg-white">
                            {image ? (
                              <Image
                                src={image}
                                alt={
                                  product?.name ??
                                  item.name
                                }
                                fill
                                sizes="96px"
                                className="object-contain"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-[10px] text-zinc-400">
                                No image
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="min-w-0 flex-1 space-y-1">
                            <h3 className="cursor-pointer text-sm font-semibold leading-snug text-black hover:underline sm:text-base">
                              {product?.name ??
                                item.name}
                            </h3>

                            {detailedProduct?.brand && (
                              <p className="text-xs text-zinc-500">
                                by{" "}
                                <strong className="font-medium text-black">
                                  {
                                    detailedProduct
                                      .brand.name
                                  }
                                </strong>
                              </p>
                            )}

                            {variant?.optionValue && (
                              <p className="text-xs text-zinc-600">
                                {variant.optionName ||
                                  "Color"}
                                :{" "}
                                <span className="font-semibold text-black">
                                  {
                                    variant.optionValue
                                  }
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
                              <Price
                                price={
                                  item.price
                                }
                              />
                            </p>
                          </div>

                          {/* Item Action */}
                          <div className="w-full shrink-0 pt-2 sm:w-auto sm:pt-0">
                            <Link
                              href={`/products/${
                                product?.slug ??
                                item.productId
                              }`}
                              className="block border border-zinc-300 bg-white px-4 py-1.5 text-center text-xs font-semibold text-black transition hover:bg-zinc-50"
                            >
                              Buy it again
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>

              {/* REVIEW */}
              {isDelivered &&
                firstEntry && (
                  <div className="mt-4 border-t border-zinc-200 pt-6">
                    <h3 className="mb-3 text-sm font-bold text-black">
                      Write a Product Review
                    </h3>

                    <ReviewForm
                      productId={
                        firstEntry.item.productId
                      }
                      orderId={order.id}
                      orderItemId={
                        firstEntry.item.id
                      }
                      variantId={
                        firstEntry.item.variantId
                      }
                    />
                  </div>
                )}
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6 lg:col-span-4">
              <div className="space-y-2.5">
                <Link
                  href={`/track/${order.orderNumber}`}
                  className="block w-full bg-black py-3 text-center text-xs font-bold tracking-wide text-white transition hover:bg-zinc-800"
                >
                  Track Package
                </Link>

                <Link
                  href="/account/orders"
                  className="block w-full border border-zinc-300 bg-white py-2.5 text-center text-xs font-semibold text-black transition hover:bg-zinc-50"
                >
                  View All Orders
                </Link>
              </div>

              {/* PAYMENT SUMMARY */}
              <div className="space-y-2 border-t border-zinc-200 pt-4 text-xs">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-black">
                  Payment Summary
                </h4>

                <div className="flex justify-between text-zinc-600">
                  <span>Items:</span>

                  <span className="font-medium text-black">
                    <Price
                      price={order.subtotal}
                    />
                  </span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>Shipping:</span>

                  <span className="font-medium text-black">
                    <Price
                      price={order.shipping}
                    />
                  </span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>Tax:</span>

                  <span className="font-medium text-black">
                    <Price price={order.tax} />
                  </span>
                </div>

                <div className="flex justify-between border-t border-zinc-200 pt-2 text-sm font-bold text-black">
                  <span>Order Total:</span>

                  <span>
                    <Price
                      price={order.total}
                    />
                  </span>
                </div>
              </div>

              {/* HELP */}
              <div className="space-y-1 border-t border-zinc-200 pt-4 text-xs leading-relaxed text-zinc-500">
                <p className="font-bold text-black">
                  Need help with your order?
                </p>

                <p>
                  Visit our{" "}
                  <Link
                    href="/contact"
                    className="underline hover:text-black"
                  >
                    Customer Support
                  </Link>{" "}
                  or review the{" "}
                  <Link
                    href="/refund-policy"
                    className="underline hover:text-black"
                  >
                    Return Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
}