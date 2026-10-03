import { NextResponse } from "next/server";

import {
  ExchangeRateRepository,
} from "@africasuk/database";

import {
  ExchangeRateService,
} from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import { sendEmail } from "@/lib/zeptomail";

type OrderItem = {
  id?: string | null;
  productId?: string | null;
  variantId?: string | null;
  productName?: string | null;
  name?: string | null;
  image?: string | null;
  price?: number | null;
  quantity?: number | null;
};

type Order = {
  id?: string | null;
  orderNumber: string;
  status?: string | null;
  paymentStatus?: string | null;
  paymentMethod?: string | null;
  subtotal?: number | null;
  shipping?: number | null;
  tax?: number | null;
  discount?: number | null;
  total?: number | null;
  currency?: string | null;
  createdAt?: string | null;
};

type Customer = {
  name?: string | null;
  email: string;
  phone?: string | null;
};

type RequestBody = {
  order: Order;
  customer: Customer;
  items: OrderItem[];
};

function formatSSPFromUSD(
  value: number,
  exchangeRate: number,
) {
  const ssp =
    Number(value || 0) * exchangeRate;

  return `SSP ${ssp.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
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

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as RequestBody;

    const {
      order,
      customer,
      items,
    } = body;

    if (!order?.orderNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Order number is required.",
        },
        { status: 400 },
      );
    }

    if (!customer?.email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer email is required.",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        {
          success: false,
          message: "Order items are required.",
        },
        { status: 400 },
      );
    }

    /*
     * Get the current exchange rate directly
     * from the admin-controlled database.
     *
     * Mobile does NOT need to send the rate.
     */
    const supabase =
      await createServerSupabaseClient();

    const exchangeRateService =
      new ExchangeRateService(
        new ExchangeRateRepository(
          supabase,
        ),
      );

    const currentRate =
      await exchangeRateService.getCurrent();

    if (!currentRate?.rate) {
      throw new Error(
        "Current exchange rate is not available.",
      );
    }

    const exchangeRate = currentRate.rate;

    const customerName = escapeHtml(
      customer.name ||
        customer.email.split("@")[0],
    );

    const itemRows = items
      .map((item) => {
        const productName = escapeHtml(
          item.productName ||
            item.name ||
            "Product",
        );

        const quantity = Number(
          item.quantity || 1,
        );

        const price = Number(
          item.price || 0,
        );

        const itemTotal =
          price * quantity;

        return `
          <tr>
            <td
              style="
                padding:14px 0;
                border-bottom:1px solid #eeeeee;
                color:#222222;
                font-size:14px;
              "
            >
              ${productName}
            </td>

            <td
              style="
                padding:14px 0;
                border-bottom:1px solid #eeeeee;
                text-align:center;
                color:#555555;
                font-size:14px;
              "
            >
              ${quantity}
            </td>

            <td
              style="
                padding:14px 0;
                border-bottom:1px solid #eeeeee;
                text-align:right;
                color:#005c2e;
                font-size:14px;
                font-weight:600;
              "
            >
              ${formatSSPFromUSD(
                itemTotal,
                exchangeRate,
              )}
            </td>
          </tr>
        `;
      })
      .join("");

    const totalSSP =
      formatSSPFromUSD(
        Number(order.total || 0),
        exchangeRate,
      );

    const subtotalSSP =
      formatSSPFromUSD(
        Number(order.subtotal || 0),
        exchangeRate,
      );

    const shippingSSP =
      formatSSPFromUSD(
        Number(order.shipping || 0),
        exchangeRate,
      );

    const taxSSP =
      formatSSPFromUSD(
        Number(order.tax || 0),
        exchangeRate,
      );

    const trackingUrl =
      `https://www.africasuk.com/track/` +
      encodeURIComponent(
        order.orderNumber,
      );

    await sendEmail({
      to: customer.email.trim().toLowerCase(),

      subject:
        `Africa Suk Order Confirmed #${order.orderNumber}`,

      htmlbody: `
        <!DOCTYPE html>

        <html>
          <head>
            <meta charset="UTF-8" />

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />

            <title>
              Africa Suk Order Confirmation
            </title>
          </head>

          <body
            style="
              margin:0;
              padding:0;
              background:#f4f4f4;
              font-family:Arial,Helvetica,sans-serif;
            "
          >
            <div
              style="
                width:100%;
                background:#f4f4f4;
                padding:30px 0;
              "
            >
              <div
                style="
                  max-width:600px;
                  margin:0 auto;
                  background:#ffffff;
                "
              >

                <!-- LOGO -->

                <div
                  style="
                    padding:24px;
                    text-align:center;
                    background:#ffffff;
                    border-bottom:1px solid #eeeeee;
                  "
                >
                  <img
                    src="https://www.africasuk.com/Newlogo.png"
                    alt="Africa Suk"
                    width="180"
                    style="
                      display:block;
                      width:180px;
                      max-width:100%;
                      height:auto;
                      margin:0 auto;
                    "
                  />
                </div>

                <!-- CONTENT -->

                <div
                  style="
                    padding:32px 24px;
                  "
                >
                  <h1
                    style="
                      margin:0 0 10px;
                      color:#005c2e;
                      font-size:26px;
                      line-height:1.3;
                    "
                  >
                    Order Confirmed
                  </h1>

                  <p
                    style="
                      margin:0 0 24px;
                      color:#333333;
                      font-size:15px;
                    "
                  >
                    Hello ${customerName},
                  </p>

                  <p
                    style="
                      margin:0 0 24px;
                      color:#555555;
                      font-size:15px;
                      line-height:1.6;
                    "
                  >
                    Thank you for shopping with
                    <strong>Africa Suk</strong>.
                    Your order has been successfully
                    placed.
                  </p>

                  <!-- ORDER NUMBER -->

                  <div
                    style="
                      background:#f7f7f7;
                      border-radius:8px;
                      padding:16px;
                      margin-bottom:28px;
                    "
                  >
                    <div
                      style="
                        color:#777777;
                        font-size:13px;
                        margin-bottom:6px;
                      "
                    >
                      Order Number
                    </div>

                    <div
                      style="
                        color:#111111;
                        font-size:18px;
                        font-weight:bold;
                      "
                    >
                      #${escapeHtml(
                        order.orderNumber,
                      )}
                    </div>
                  </div>

                  <!-- ITEMS -->

                  <h2
                    style="
                      margin:0 0 14px;
                      color:#111111;
                      font-size:18px;
                    "
                  >
                    Order Summary
                  </h2>

                  <table
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                      border-collapse:collapse;
                      width:100%;
                    "
                  >
                    <thead>
                      <tr>
                        <th
                          style="
                            padding:10px 0;
                            text-align:left;
                            color:#777777;
                            font-size:12px;
                            font-weight:normal;
                            border-bottom:1px solid #dddddd;
                          "
                        >
                          Item
                        </th>

                        <th
                          style="
                            padding:10px 0;
                            text-align:center;
                            color:#777777;
                            font-size:12px;
                            font-weight:normal;
                            border-bottom:1px solid #dddddd;
                          "
                        >
                          Qty
                        </th>

                        <th
                          style="
                            padding:10px 0;
                            text-align:right;
                            color:#777777;
                            font-size:12px;
                            font-weight:normal;
                            border-bottom:1px solid #dddddd;
                          "
                        >
                          Price
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      ${itemRows}
                    </tbody>
                  </table>

                  <!-- TOTALS -->

                  <div
                    style="
                      margin-top:24px;
                      padding-top:18px;
                      border-top:2px solid #005c2e;
                    "
                  >
                    <div
                      style="
                        display:flex;
                        justify-content:space-between;
                        padding-bottom:10px;
                      "
                    >
                      <span
                        style="
                          color:#666666;
                          font-size:14px;
                        "
                      >
                        Subtotal
                      </span>

                      <strong
                        style="
                          color:#222222;
                          font-size:14px;
                        "
                      >
                        ${subtotalSSP}
                      </strong>
                    </div>

                    <div
                      style="
                        display:flex;
                        justify-content:space-between;
                        padding-bottom:10px;
                      "
                    >
                      <span
                        style="
                          color:#666666;
                          font-size:14px;
                        "
                      >
                        Shipping
                      </span>

                      <strong
                        style="
                          color:#222222;
                          font-size:14px;
                        "
                      >
                        ${shippingSSP}
                      </strong>
                    </div>

                    <div
                      style="
                        display:flex;
                        justify-content:space-between;
                        padding-bottom:10px;
                      "
                    >
                      <span
                        style="
                          color:#666666;
                          font-size:14px;
                        "
                      >
                        Tax
                      </span>

                      <strong
                        style="
                          color:#222222;
                          font-size:14px;
                        "
                      >
                        ${taxSSP}
                      </strong>
                    </div>

                    <div
                      style="
                        display:flex;
                        justify-content:space-between;
                        padding-top:6px;
                      "
                    >
                      <span
                        style="
                          color:#111111;
                          font-size:16px;
                          font-weight:bold;
                        "
                      >
                        Total
                      </span>

                      <strong
                        style="
                          color:#005c2e;
                          font-size:19px;
                        "
                      >
                        ${totalSSP}
                      </strong>
                    </div>
                  </div>

                  <!-- TRACK ORDER -->

                  <div
                    style="
                      text-align:center;
                      margin-top:30px;
                    "
                  >
                    <a
                      href="${trackingUrl}"
                      style="
                        display:inline-block;
                        background:#005c2e;
                        color:#ffffff;
                        text-decoration:none;
                        padding:13px 24px;
                        border-radius:6px;
                        font-size:14px;
                        font-weight:bold;
                      "
                    >
                      Track Your Order
                    </a>
                  </div>
                </div>

                <!-- FOOTER -->

                <div
                  style="
                    padding:22px 24px;
                    text-align:center;
                    background:#f7f7f7;
                    border-top:1px solid #eeeeee;
                  "
                >
                  <p
                    style="
                      margin:0;
                      color:#777777;
                      font-size:12px;
                    "
                  >
                    Africa Suk — Shop with Confidence
                  </p>
                </div>

              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log(
      `Order confirmation email sent successfully to ${customer.email}`,
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Order confirmation email error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send order confirmation email.",
      },
      {
        status: 500,
      },
    );
  }
}