import React, { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Download } from "lucide-react-native";

import type { Order } from "@africasuk/types";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: {
    optionName?: string;
    optionValue?: string;
  } | null;
};

interface Props {
  order: Order;
  items: OrderItem[];
  exchangeRate: number;
}

const BRAND = "#005c2e";

function formatDate(value: string) {
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

function escapeHtml(
  value: string | number | null | undefined,
) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function DownloadReceiptButton({
  order,
  items,
  exchangeRate,
}: Props) {
  const [loading, setLoading] = useState(false);

  const downloadReceipt = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const convertToSSP = (price: number) =>
        price * exchangeRate;

      const formatSSP = (price: number) =>
        `SSP ${convertToSSP(price).toLocaleString(
          "en-US",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          },
        )}`;

      const trackingUrl =
        `https://www.africasuk.com/track/${order.orderNumber}`;

      const qrCodeUrl =
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(
          trackingUrl,
        )}`;

      const itemsHtml = items
        .map((item) => {
          const unitPrice = convertToSSP(
            item.price,
          );

          const lineTotal = convertToSSP(
            item.price * item.quantity,
          );

          const variant =
            item.variant?.optionValue
              ? `
                <div class="item-meta">
                  ${
                    item.variant.optionName
                      ? `${escapeHtml(
                          item.variant.optionName,
                        )}: `
                      : ""
                  }
                  ${escapeHtml(
                    item.variant.optionValue,
                  )}
                </div>
              `
              : "";

          return `
            <div class="item">
              <div class="item-name">
                ${escapeHtml(item.name)}
              </div>

              ${variant}

              <div class="row">
                <span>
                  ${item.quantity} ×
                  ${unitPrice.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </span>

                <strong>
                  ${lineTotal.toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </strong>
              </div>
            </div>
          `;
        })
        .join("");

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />

            <style>
              @page {
                size: 80mm auto;
                margin: 0;
              }

              * {
                box-sizing: border-box;
              }

              html,
              body {
                margin: 0;
                padding: 0;
                width: 80mm;
                background: #ffffff;
                color: #000000;
                font-family:
                  Arial,
                  Helvetica,
                  sans-serif;
                font-size: 11px;
              }

              .receipt {
                width: 72mm;
                margin: 0 auto;
                padding: 4mm 0;
              }

              .logo {
                display: block;
                width: 32mm;
                height: auto;
                margin: 0 auto 3mm;
              }

              .title {
                text-align: center;
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 3mm;
              }

              .divider {
                border-top: 1px dashed #000;
                margin: 3mm 0;
              }

              .row {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 4mm;
                margin: 1.5mm 0;
                line-height: 1.35;
              }

              .section-title {
                font-size: 11px;
                font-weight: 700;
                margin-bottom: 1.5mm;
              }

              .item {
                margin-bottom: 3mm;
              }

              .item-name {
                font-weight: 700;
                line-height: 1.35;
              }

              .item-meta {
                font-size: 10px;
                margin-top: 0.5mm;
              }

              .total {
                display: flex;
                justify-content: space-between;
                gap: 4mm;
                font-size: 14px;
                font-weight: 700;
                margin: 2mm 0;
              }

              .qr {
                text-align: center;
                margin-top: 5mm;
              }

              .qr img {
                display: block;
                width: 30mm;
                height: 30mm;
                margin: 0 auto 2mm;
              }

              .footer {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 1mm;
                font-size: 10px;
                line-height: 1.3;
              }
            </style>
          </head>

          <body>
            <div class="receipt">

              <img
                src="https://www.africasuk.com/Newlogo.png"
                class="logo"
                alt="AfricaSuk"
              />

              <div class="title">
                ORDER RECEIPT
              </div>

              <div class="divider"></div>

              <div class="row">
                <span>Order</span>
                <strong>
                  ${escapeHtml(order.orderNumber)}
                </strong>
              </div>

              <div class="row">
                <span>Date</span>
                <span>
                  ${formatDate(order.createdAt)}
                </span>
              </div>

              <div class="divider"></div>

              <div class="section-title">
                CUSTOMER
              </div>

              <div>
                ${escapeHtml(order.customerName)}
              </div>

              ${
                order.customerPhone
                  ? `<div>${escapeHtml(
                      order.customerPhone,
                    )}</div>`
                  : ""
              }

              <div>
                ${escapeHtml(order.customerEmail)}
              </div>

              <div class="divider"></div>

              <div class="section-title">
                ITEMS
              </div>

              ${itemsHtml}

              <div class="divider"></div>

              <div class="row">
                <span>Subtotal</span>
                <span>
                  ${formatSSP(order.subtotal)}
                </span>
              </div>

              <div class="row">
                <span>Shipping</span>
                <span>
                  ${formatSSP(order.shipping)}
                </span>
              </div>

              ${
                order.tax > 0
                  ? `
                    <div class="row">
                      <span>Tax</span>
                      <span>
                        ${formatSSP(order.tax)}
                      </span>
                    </div>
                  `
                  : ""
              }

              ${
                order.discount > 0
                  ? `
                    <div class="row">
                      <span>Discount</span>
                      <span>
                        -${formatSSP(order.discount)}
                      </span>
                    </div>
                  `
                  : ""
              }

              <div class="divider"></div>

              <div class="total">
                <span>TOTAL</span>

                <strong>
                  ${formatSSP(order.total)}
                </strong>
              </div>

              <div class="divider"></div>

              <div class="row">
                <span>Payment</span>

                <span>
                  ${
                    order.paymentMethod ??
                    "N/A"
                  }
                </span>
              </div>

              <div class="row">
                <span>Status</span>

                <span>
                  ${order.paymentStatus}
                </span>
              </div>

              <div class="qr">
                <img
                  src="${qrCodeUrl}"
                  alt="Order tracking QR code"
                />

                <div>
                  Scan to track your order
                </div>
              </div>

              <div class="divider"></div>

              <div class="footer">
                <strong>AfricaSuk</strong>

                <span>
                  Shop with Confidence
                </span>

                <span>
                  Thank you for shopping with us.
                </span>
              </div>

            </div>
          </body>
        </html>
      `;

      const { uri } =
        await Print.printToFileAsync({
          html,
          width: 302,
          height: 1200,
          base64: false,
        });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle:
            "Download AfricaSuk Receipt",
          UTI: "com.adobe.pdf",
        });
      } else {
        Alert.alert(
          "Receipt Ready",
          `Receipt saved at:\n${uri}`,
        );
      }
    } catch (error) {
      console.error(
        "Receipt download error:",
        error,
      );

      Alert.alert(
        "Receipt Error",
        "Unable to create the receipt. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={downloadReceipt}
      disabled={loading}
      style={{
        height: 44,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#d1d5db",
        backgroundColor: "#ffffff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: loading ? 0.6 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={BRAND}
        />
      ) : (
        <Download
          size={17}
          color={BRAND}
        />
      )}

      <Text
        style={{
          color: "#111111",
          fontSize: 13,
          fontWeight: "600",
        }}
      >
        {loading
          ? "Preparing..."
          : "Download Receipt"}
      </Text>
    </Pressable>
  );
}