import { format } from "date-fns";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CheckCircle2 } from "lucide-react";

import { getOrder } from "@/actions/orders";
import { createClient } from "@/lib/auth/server";

import Container from "@/components/layout/Container";
import Layout from "@/components/layout/Layout";
import { Price } from "@/components/currency/Price";
import type { ProductWithDetails } from "@africasuk/types";
import { ReviewForm } from "@/components/products/ReviewForm";
import { PrintOrderButton } from "@/components/orders/PrintOrderButton";
import { SendReceiptButton } from "@/components/orders/SendReceiptButton";

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
  const firstEntry = items[0];

  /*
   * Receipt QR code
   * Opens the live Africa Suk order tracking page.
   */
  const trackingUrl = `https://africasuk.com/track/${order.orderNumber}`;

  const qrCodeUrl =
    `https://api.qrserver.com/v1/create-qr-code/` +
    `?size=250x250` +
    `&margin=0` +
    `&data=${encodeURIComponent(trackingUrl)}`;

  return (
    <Layout>
      {/* ================================================================
          PRINT STYLES — 80MM THERMAL RECEIPT
      ================================================================= */}

      <style>{`
        @media print {

          @page {
            size: 80mm auto;
            margin: 0;
          }

          /*
           * IMPORTANT:
           * Remove the normal website from the print layout.
           * visibility:hidden alone still allows elements to occupy space.
           */
          html,
          body {
            width: 80mm !important;
            min-width: 80mm !important;

            height: auto !important;
            min-height: 0 !important;

            margin: 0 !important;
            padding: 0 !important;

            background: #ffffff !important;
          }

          /*
           * Hide the normal application visually.
           */
          body > * {
            visibility: hidden !important;
          }

          /*
           * Show only the receipt.
           */
          #africasuk-receipt,
          #africasuk-receipt * {
            visibility: visible !important;
          }

          /*
           * Remove normal page layout from the print flow.
           */
          body {
            overflow: visible !important;
          }

          #africasuk-receipt {
            position: absolute !important;

            top: 0 !important;
            left: 0 !important;

            width: 80mm !important;

            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;

            margin: 0 !important;

            padding: 5mm 4mm 6mm !important;

            display: block !important;

            box-sizing: border-box !important;

            overflow: visible !important;

            background: #ffffff !important;
            color: #111111 !important;

            font-family:
              Arial,
              Helvetica,
              sans-serif !important;

            font-size: 12px !important;
            line-height: 1.35 !important;
          }

          #africasuk-receipt * {
            box-sizing: border-box !important;
          }

          /* ============================================================
             HEADER
          ============================================================ */

          #africasuk-receipt .receipt-header {
            display: block !important;

            padding-bottom: 4mm !important;

            border-bottom: 2px solid #005c2e !important;

            text-align: center !important;
          }

          #africasuk-receipt .receipt-brand {
            color: #005c2e !important;
          }

          #africasuk-receipt .receipt-brand-name {
            margin: 0 !important;

            font-size: 25px !important;
            line-height: 1 !important;

            font-weight: 900 !important;

            letter-spacing: -0.5px !important;
          }

          #africasuk-receipt .receipt-brand-tagline {
            margin-top: 4px !important;

            color: #444444 !important;

            font-size: 9px !important;
            line-height: 1.2 !important;

            font-weight: 700 !important;

            letter-spacing: 0.08em !important;

            text-transform: uppercase !important;
          }

          #africasuk-receipt .receipt-heading {
            margin-top: 4mm !important;

            text-align: center !important;
          }

          #africasuk-receipt .receipt-heading-title {
            margin: 0 !important;

            color: #111111 !important;

            font-size: 18px !important;
            line-height: 1.15 !important;

            font-weight: 800 !important;
          }

          #africasuk-receipt .receipt-heading-subtitle {
            margin-top: 3px !important;

            color: #555555 !important;

            font-size: 10px !important;
            line-height: 1.3 !important;
          }

          /* ============================================================
             ORDER INFORMATION
          ============================================================ */

          #africasuk-receipt .receipt-info {
            display: block !important;

            padding: 4mm 0 !important;

            border-bottom: 1px dashed #777777 !important;
          }

          #africasuk-receipt .receipt-info-column {
            display: block !important;
          }

          #africasuk-receipt .receipt-info-column + .receipt-info-column {
            margin-top: 2mm !important;
          }

          #africasuk-receipt .receipt-info-row {
            display: flex !important;

            justify-content: space-between !important;
            align-items: flex-start !important;

            gap: 3mm !important;

            margin-bottom: 2mm !important;
          }

          #africasuk-receipt .receipt-info-row:last-child {
            margin-bottom: 0 !important;
          }

          #africasuk-receipt .receipt-info-label {
            flex-shrink: 0 !important;

            color: #555555 !important;

            font-size: 10px !important;
            line-height: 1.3 !important;

            font-weight: 700 !important;

            text-transform: uppercase !important;
          }

          #africasuk-receipt .receipt-info-value {
            min-width: 0 !important;

            color: #111111 !important;

            font-size: 12px !important;
            line-height: 1.3 !important;

            font-weight: 700 !important;

            text-align: right !important;

            overflow-wrap: anywhere !important;
          }

          /* ============================================================
             ITEMS
          ============================================================ */

          #africasuk-receipt .receipt-items {
            padding: 4mm 0 !important;
          }

          #africasuk-receipt .receipt-items-header {
            display: grid !important;

            grid-template-columns: 1fr 10mm 22mm !important;

            padding: 2.5mm 0 !important;

            border-top: 1px solid #111111 !important;
            border-bottom: 1px solid #111111 !important;

            background: #ffffff !important;

            color: #111111 !important;

            font-size: 9px !important;
            line-height: 1.2 !important;

            font-weight: 800 !important;

            text-transform: uppercase !important;
          }

          #africasuk-receipt
            .receipt-items-header span:nth-child(2),
          #africasuk-receipt
            .receipt-items-header span:nth-child(3) {
            text-align: right !important;
          }

          #africasuk-receipt .receipt-item {
            display: grid !important;

            grid-template-columns: 1fr 10mm 22mm !important;

            align-items: start !important;

            gap: 2mm !important;

            padding: 3.5mm 0 !important;

            border-bottom: 1px dashed #cccccc !important;

            break-inside: avoid !important;

            page-break-inside: avoid !important;
          }

          #africasuk-receipt .receipt-item-name {
            min-width: 0 !important;

            color: #111111 !important;

            font-size: 12px !important;
            line-height: 1.3 !important;

            font-weight: 700 !important;

            overflow-wrap: anywhere !important;
            word-break: normal !important;
          }

          #africasuk-receipt .receipt-item-detail {
            margin-top: 2px !important;

            color: #555555 !important;

            font-size: 10px !important;
            line-height: 1.3 !important;
          }

          #africasuk-receipt .receipt-item-qty {
            color: #111111 !important;

            font-size: 11px !important;
            line-height: 1.3 !important;

            font-weight: 700 !important;

            text-align: right !important;
          }

          #africasuk-receipt .receipt-item-total {
            color: #111111 !important;

            font-size: 12px !important;
            line-height: 1.3 !important;

            font-weight: 800 !important;

            text-align: right !important;

            white-space: nowrap !important;
          }

          /* ============================================================
             PAYMENT
          ============================================================ */

          #africasuk-receipt .receipt-summary {
            display: block !important;

            margin-top: 3mm !important;
          }

          #africasuk-receipt .receipt-payment {
            padding: 3mm 0 !important;

            border-top: 1px dashed #777777 !important;
            border-bottom: 1px dashed #777777 !important;

            border-radius: 0 !important;
          }

          #africasuk-receipt .receipt-section-label {
            color: #555555 !important;

            font-size: 10px !important;
            line-height: 1.2 !important;

            font-weight: 700 !important;

            text-transform: uppercase !important;
          }

          #africasuk-receipt .receipt-payment-method {
            margin-top: 3px !important;

            color: #111111 !important;

            font-size: 13px !important;
            line-height: 1.3 !important;

            font-weight: 800 !important;

            text-transform: uppercase !important;
          }

          #africasuk-receipt .receipt-status {
            display: inline-flex !important;

            margin-top: 4px !important;

            padding: 3px 7px !important;

            border-radius: 3px !important;

            background: #ecfdf3 !important;
            color: #166534 !important;

            font-size: 9px !important;
            line-height: 1.2 !important;

            font-weight: 800 !important;

            text-transform: uppercase !important;
          }

          /* ============================================================
             TOTALS
          ============================================================ */

          #africasuk-receipt .receipt-totals {
            margin-top: 3mm !important;

            padding: 3mm 0 !important;

            background: #ffffff !important;
          }

          #africasuk-receipt .receipt-total-row {
            display: flex !important;

            justify-content: space-between !important;
            align-items: center !important;

            padding: 1.5mm 0 !important;

            color: #444444 !important;

            font-size: 12px !important;
            line-height: 1.3 !important;
          }

          #africasuk-receipt .receipt-grand-total {
            display: flex !important;

            justify-content: space-between !important;
            align-items: center !important;

            margin-top: 2mm !important;

            padding: 3mm 0 !important;

            border-top: 2px solid #111111 !important;
            border-bottom: 2px solid #111111 !important;

            color: #111111 !important;

            font-size: 17px !important;
            line-height: 1.2 !important;

            font-weight: 900 !important;
          }

          /* ============================================================
             FOOTER
          ============================================================ */

          #africasuk-receipt .receipt-footer {
            display: block !important;

            margin-top: 5mm !important;

            padding-top: 4mm !important;

            border-top: 1px dashed #777777 !important;

            text-align: center !important;
          }

          #africasuk-receipt .receipt-footer-message {
            max-width: none !important;
          }

          #africasuk-receipt .receipt-footer-title {
            color: #005c2e !important;

            font-size: 13px !important;
            line-height: 1.3 !important;

            font-weight: 800 !important;
          }

          #africasuk-receipt .receipt-footer-text {
            margin-top: 3px !important;

            color: #555555 !important;

            font-size: 10px !important;
            line-height: 1.5 !important;
          }

          /* ============================================================
             QR CODE
          ============================================================ */

          #africasuk-receipt .receipt-qr {
            margin-top: 4mm !important;

            text-align: center !important;
          }

          #africasuk-receipt .receipt-qr img {
            display: block !important;

            width: 27mm !important;
            height: 27mm !important;

            margin: 0 auto 3mm !important;

            object-fit: contain !important;
          }

          #africasuk-receipt .receipt-qr-label {
            margin: 0 !important;

            color: #444444 !important;

            font-size: 9px !important;
            line-height: 1.3 !important;

            font-weight: 700 !important;

            text-transform: uppercase !important;
          }

          #africasuk-receipt .receipt-bottom-line {
            margin-top: 3mm !important;

            color: #555555 !important;

            font-size: 9px !important;
            line-height: 1.3 !important;

            text-align: center !important;
          }
        }
      `}</style>

      {/* ================================================================
          THERMAL RECEIPT
      ================================================================= */}

      {isDelivered && (
        <div
          id="africasuk-receipt"
          className="hidden print:block"
        >
          {/* HEADER */}
          <div className="receipt-header">
            <div className="receipt-brand">
              <div className="receipt-brand-name">
                AFRICA SUK
              </div>

              <div className="receipt-brand-tagline">
                Shop with Confidence
              </div>
            </div>

            <div className="receipt-heading">
              <div className="receipt-heading-title">
                RECEIPT
              </div>

              <div className="receipt-heading-subtitle">
                Juba, South Sudan
              </div>

              <div className="receipt-heading-subtitle">
                support@africasuk.com
              </div>
            </div>
          </div>

          {/* ORDER INFORMATION */}
          <div className="receipt-info">
            <div className="receipt-info-column">
              <div className="receipt-info-row">
                <span className="receipt-info-label">
                  Order
                </span>

                <span className="receipt-info-value">
                  #{order.orderNumber}
                </span>
              </div>

              <div className="receipt-info-row">
                <span className="receipt-info-label">
                  Date
                </span>

                <span className="receipt-info-value">
                  {format(
                    new Date(order.createdAt),
                    "dd MMM yyyy, HH:mm"
                  )}
                </span>
              </div>

              <div className="receipt-info-row">
                <span className="receipt-info-label">
                  Payment
                </span>

                <span className="receipt-info-value">
                  {(
                    order.paymentMethod ||
                    "Cash on Delivery"
                  ).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="receipt-info-column">
              <div className="receipt-info-row">
                <span className="receipt-info-label">
                  Customer
                </span>

                <span className="receipt-info-value">
                  {order.customerName}
                </span>
              </div>

              <div className="receipt-info-row">
                <span className="receipt-info-label">
                  Phone
                </span>

                <span className="receipt-info-value">
                  {order.customerPhone || "—"}
                </span>
              </div>

              <div className="receipt-info-row">
                <span className="receipt-info-label">
                  Delivery
                </span>

                <span className="receipt-info-value">
                  {order.city || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* ITEMS */}
          <div className="receipt-items">
            <div className="receipt-items-header">
              <span>Item</span>
              <span>Qty</span>
              <span>Amount</span>
            </div>

            {items.map(({ item, product, variant }) => (
              <div
                key={item.id}
                className="receipt-item"
              >
                <div>
                  <div className="receipt-item-name">
                    {product?.name ?? item.name}
                  </div>

                  <div className="receipt-item-detail">
                    {variant?.optionValue
                      ? `${variant.optionName || "Option"}: ${variant.optionValue} • `
                      : ""}
                    Unit price: $
                    {Number(item.price).toFixed(2)}
                  </div>
                </div>

                <div className="receipt-item-qty">
                  {item.quantity}
                </div>

                <div className="receipt-item-total">
                  $
                  {(
                    Number(item.price) *
                    Number(item.quantity)
                  ).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* PAYMENT + TOTAL */}
          <div className="receipt-summary">
            <div className="receipt-payment">
              <div className="receipt-section-label">
                Payment Information
              </div>

              <div className="receipt-payment-method">
                {order.paymentMethod ||
                  "Cash on Delivery"}
              </div>

              <div className="receipt-status">
                ✓ Paid &amp; Delivered
              </div>
            </div>

            <div className="receipt-totals">
              <div className="receipt-total-row">
                <span>Subtotal</span>

                <span>
                  ${Number(order.subtotal).toFixed(2)}
                </span>
              </div>

              <div className="receipt-total-row">
                <span>Shipping</span>

                <span>
                  ${Number(order.shipping).toFixed(2)}
                </span>
              </div>

              <div className="receipt-total-row">
                <span>Tax</span>

                <span>
                  ${Number(order.tax).toFixed(2)}
                </span>
              </div>

              <div className="receipt-grand-total">
                <span>TOTAL PAID</span>

                <span>
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="receipt-footer">
            <div className="receipt-footer-message">
              <div className="receipt-footer-title">
                Thank you for shopping with Africa Suk.
              </div>

              <div className="receipt-footer-text">
                Your order has been successfully
                delivered.
                <br />
                www.africasuk.com
                <br />
                support@africasuk.com
              </div>
            </div>

            <div className="receipt-qr">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCodeUrl}
                alt="Track order"
              />

              <p className="receipt-qr-label">
                Scan to verify &amp; track order
              </p>
            </div>
          </div>

          <div className="receipt-bottom-line">
            Electronic receipt • Africa Suk
          </div>
        </div>
      )}

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
                  "MMMM d, yyyy"
                )}{" "}
                • Order #{order.orderNumber}
              </p>
            </div>

            {isDelivered && (
              <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
                <PrintOrderButton />

                <SendReceiptButton
                  orderNumber={order.orderNumber}
                />
              </div>
            )}
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

                <span className="mt-0.5 block text-zinc-600">
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
                      : order.status === "CANCELLED"
                        ? "Order Cancelled"
                        : `Expected delivery: ${
                            order.estimatedDeliveryEnd
                              ? format(
                                  new Date(
                                    order.estimatedDeliveryEnd
                                  ),
                                  "MMMM d, yyyy"
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
                  ({ item, product, variant }) => {
                    const detailedProduct =
                      product as ProductWithDetails;

                    const image = item.image ?? null;

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
                              <Price
                                price={item.price}
                              />
                            </p>
                          </div>

                          {/* Item Action */}
                          <div className="w-full shrink-0 pt-2 sm:w-auto sm:pt-0">
                            <Link
                              href={`/products/${
                                product?.slug ||
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
                  }
                )}
              </div>

              {/* REVIEW */}
              {isDelivered && firstEntry && (
                <div className="mt-4 border-t border-zinc-200 pt-6">
                  <h3 className="mb-3 text-sm font-bold text-black">
                    Write a Product Review
                  </h3>

                  <ReviewForm
                    productId={
                      firstEntry.item.productId
                    }
                    orderId={order.id}
                    orderItemId={firstEntry.item.id}
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
                    <Price price={order.subtotal} />
                  </span>
                </div>

                <div className="flex justify-between text-zinc-600">
                  <span>Shipping:</span>

                  <span className="font-medium text-black">
                    <Price price={order.shipping} />
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
                    <Price price={order.total} />
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