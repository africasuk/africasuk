"use client";

import type { Order } from "@africasuk/types";
import type { OrderItemDetails } from "@africasuk/api";

interface Props {
  order: Order;
  items: OrderItemDetails[];
  exchangeRate: number;
}

function formatReceiptDate(value: string) {
  const date = new Date(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${day}/${month}/${year}, ${hours}:${minutes} ${period}`;
}

export function PrintableReceipt({
  order,
  items,
  exchangeRate,
}: Props) {
  const trackingUrl = `https://www.africasuk.com/track/${order.orderNumber}`;

  const qrCodeUrl =
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(
      trackingUrl,
    )}`;

  // All stored order prices are USD.
  // Receipt displays everything in SSP.
  const convertToSSP = (price: number) => {
    return price * exchangeRate;
  };

  const formatSSP = (price: number) => {
    return `SSP ${convertToSSP(price).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}`;
  };

  return (
    <div
      id="africasuk-receipt"
      className="hidden"
    >
      <div className="receipt-inner">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.africasuk.com/Newlogo.png"
          alt="AfricaSuk"
          className="receipt-logo"
        />

        <div className="receipt-title">
          ORDER RECEIPT
        </div>

        <div className="receipt-divider" />

        {/* Order */}
        <div className="receipt-row">
          <span>Order</span>
          <strong>
            {order.orderNumber}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Date</span>
          <span>
            {formatReceiptDate(
              order.createdAt,
            )}
          </span>
        </div>

        <div className="receipt-divider" />

        {/* Customer */}
        <div className="receipt-section-title">
          CUSTOMER
        </div>

        <div>
          {order.customerName}
        </div>

        {order.customerPhone && (
          <div>
            {order.customerPhone}
          </div>
        )}

        <div>
          {order.customerEmail}
        </div>

        <div className="receipt-divider" />

        {/* Items */}
        <div className="receipt-section-title">
          ITEMS
        </div>

        {items.map(({ item, variant }) => {
          const unitPrice = convertToSSP(
            item.price,
          );

          const lineTotal = convertToSSP(
            item.price * item.quantity,
          );

          return (
            <div
              key={item.id}
              className="receipt-item"
            >
              <div className="receipt-item-name">
                {item.name}
              </div>

              {variant && (
                <div className="receipt-item-meta">
                  {variant.optionName &&
                    `${variant.optionName}: `}
                  {variant.optionValue}
                </div>
              )}

              <div className="receipt-row">
                <span>
                  {item.quantity} ×{" "}
                  {unitPrice.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </span>

                <strong>
                  {lineTotal.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </strong>
              </div>
            </div>
          );
        })}

        <div className="receipt-divider" />

        {/* Summary */}
        <div className="receipt-row">
          <span>Subtotal</span>
          <span>
            {formatSSP(order.subtotal)}
          </span>
        </div>

        <div className="receipt-row">
          <span>Shipping</span>
          <span>
            {formatSSP(order.shipping)}
          </span>
        </div>

        {order.tax > 0 && (
          <div className="receipt-row">
            <span>Tax</span>
            <span>
              {formatSSP(order.tax)}
            </span>
          </div>
        )}

        {order.discount > 0 && (
          <div className="receipt-row">
            <span>Discount</span>
            <span>
              -{formatSSP(order.discount)}
            </span>
          </div>
        )}

        <div className="receipt-divider" />

        {/* Total */}
        <div className="receipt-total">
          <span>TOTAL</span>

          <strong>
            {formatSSP(order.total)}
          </strong>
        </div>

        <div className="receipt-divider" />

        {/* Payment */}
        <div className="receipt-row">
          <span>Payment</span>

          <span>
            {order.paymentMethod ?? "N/A"}
          </span>
        </div>

        <div className="receipt-row">
          <span>Status</span>

          <span>
            {order.paymentStatus}
          </span>
        </div>

        {/* Tracking QR */}
        <div className="receipt-qr">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrCodeUrl}
            alt="Order tracking QR code"
            className="receipt-qr-image"
          />

          <div>
            Scan to track your order
          </div>
        </div>

        <div className="receipt-divider" />

        {/* Footer */}
        <div className="receipt-footer">
          <strong>AfricaSuk</strong>

          <span>
            Shop with Confidence
          </span>

          <span>
            Thank you for shopping with us.
          </span>
        </div>
      </div>
    </div>
  );
}