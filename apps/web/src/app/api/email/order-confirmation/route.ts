import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/zeptomail";

type OrderItem = {
  productName?: string | null;
  name?: string | null;
  quantity?: number | null;
  price?: number | null;
};

type Order = {
  id?: string | null;
  orderNumber: string;
  status?: string | null;
  paymentStatus?: string | null;
  paymentMethod?: string | null;
  subtotal?: number | null;
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
  exchangeRate?: number | null;
};

const DEFAULT_EXCHANGE_RATE = 7900;

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

function getExchangeRate(
  exchangeRate: number | null | undefined,
) {
  const rate = Number(exchangeRate);

  if (Number.isFinite(rate) && rate > 0) {
    return rate;
  }

  return DEFAULT_EXCHANGE_RATE;
}

function formatSSPFromUSD(
  value: number,
  exchangeRate: number,
) {
  const ssp = Number(value || 0) * exchangeRate;

  return `SSP ${ssp.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    const {
      order,
      customer,
      items,
      exchangeRate: requestedExchangeRate,
    } = body;

    // --------------------------------------------------
    // Validate request
    // --------------------------------------------------

    if (!order?.orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Order number is required.",
        },
        { status: 400 },
      );
    }

    if (!customer?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Customer email is required.",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order items are required.",
        },
        { status: 400 },
      );
    }

    // --------------------------------------------------
    // Exchange rate
    //
    // Africa Suk uses:
    //
    // 1 USD = 7,900 SSP
    //
    // If the mobile app sends the current rate,
    // that rate is used.
    //
    // Existing requests that don't send a rate
    // fall back to 7,900.
    // --------------------------------------------------

    const exchangeRate = getExchangeRate(
      requestedExchangeRate,
    );

    console.log(
      "Order confirmation exchange rate:",
      exchangeRate,
    );

    // --------------------------------------------------
    // Customer
    // --------------------------------------------------

    const customerName = escapeHtml(
      customer.name?.trim() ||
        customer.email.split("@")[0],
    );

    const customerEmail = customer.email
      .trim()
      .toLowerCase();

    // --------------------------------------------------
    // Order items
    // --------------------------------------------------

    const itemsHtml = items
      .map((item) => {
        const productName = escapeHtml(
          item.productName ||
            item.name ||
            "Product",
        );

        const quantity = Math.max(
          1,
          Number(item.quantity || 1),
        );

        const price = Number(item.price || 0);

        const itemTotalUSD = price * quantity;

        const itemTotalSSP =
          formatSSPFromUSD(
            itemTotalUSD,
            exchangeRate,
          );

        return `
          <tr>
            <td
              style="
                padding: 15px 0;
                border-bottom: 1px solid #eeeeee;
                color: #222222;
                font-size: 14px;
                line-height: 20px;
                vertical-align: top;
              "
            >
              <strong>
                ${productName}
              </strong>

              <div
                style="
                  margin-top: 4px;
                  color: #777777;
                  font-size: 13px;
                "
              >
                Quantity: ${quantity}
              </div>
            </td>

            <td
              align="right"
              style="
                padding: 15px 0;
                border-bottom: 1px solid #eeeeee;
                color: #222222;
                font-size: 14px;
                font-weight: 600;
                white-space: nowrap;
                vertical-align: top;
              "
            >
              ${itemTotalSSP}
            </td>
          </tr>
        `;
      })
      .join("");

    // --------------------------------------------------
    // Totals
    // --------------------------------------------------

    const subtotalUSD = Number(
      order.subtotal || 0,
    );

    const totalUSD = Number(
      order.total || 0,
    );

    const subtotalSSP = formatSSPFromUSD(
      subtotalUSD,
      exchangeRate,
    );

    const totalSSP = formatSSPFromUSD(
      totalUSD,
      exchangeRate,
    );

    // --------------------------------------------------
    // Order information
    // --------------------------------------------------

    const orderNumber = escapeHtml(
      order.orderNumber,
    );

    const paymentMethod = escapeHtml(
      order.paymentMethod ||
        "Cash on Delivery",
    );

    const paymentStatus = escapeHtml(
      order.paymentStatus ||
        "Pending",
    );

    const trackingUrl =
      `https://www.africasuk.com/track/${encodeURIComponent(
        order.orderNumber,
      )}`;

    // --------------------------------------------------
    // Email
    // --------------------------------------------------

    const htmlbody = `
<!DOCTYPE html>
<html lang="en">

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
    margin: 0;
    padding: 0;
    background: #f5f5f5;
    font-family: Arial, Helvetica, sans-serif;
    color: #222222;
  "
>

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width: 100%;
      background: #f5f5f5;
    "
  >

    <tr>
      <td
        align="center"
        style="
          padding: 30px 15px;
        "
      >

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width: 100%;
            max-width: 600px;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
          "
        >

          <!-- =========================================
               LOGO
          ========================================== -->

          <tr>
            <td
              align="center"
              style="
                background: #ffffff;
                padding: 28px 30px;
                border-bottom: 1px solid #eeeeee;
              "
            >

              <img
                src="https://www.africasuk.com/Newlogo.png"
                alt="Africa Suk"
                width="160"
                style="
                  display: block;
                  width: 160px;
                  max-width: 160px;
                  height: auto;
                  margin: 0 auto;
                  border: 0;
                "
              />

            </td>
          </tr>

          <!-- =========================================
               CONFIRMATION
          ========================================== -->

          <tr>
            <td
              align="center"
              style="
                padding: 32px 30px 20px;
              "
            >

              <div
                style="
                  display: inline-block;
                  padding: 7px 14px;
                  background: #e8f5ee;
                  color: #005c2e;
                  border-radius: 20px;
                  font-size: 12px;
                  font-weight: bold;
                  letter-spacing: 0.5px;
                "
              >
                ORDER CONFIRMED
              </div>

              <h1
                style="
                  margin: 16px 0 0;
                  color: #005c2e;
                  font-size: 26px;
                  line-height: 34px;
                "
              >
                Thank you for your order!
              </h1>

              <p
                style="
                  margin: 10px 0 0;
                  color: #666666;
                  font-size: 15px;
                  line-height: 24px;
                "
              >
                Hi ${customerName}, your order
                has been successfully placed.
              </p>

            </td>
          </tr>

          <!-- =========================================
               ORDER NUMBER
          ========================================== -->

          <tr>
            <td
              style="
                padding: 8px 30px 25px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background: #f7f7f7;
                  border-radius: 8px;
                "
              >

                <tr>
                  <td
                    align="center"
                    style="
                      padding: 16px;
                    "
                  >

                    <div
                      style="
                        color: #777777;
                        font-size: 11px;
                        font-weight: 600;
                        letter-spacing: 0.8px;
                      "
                    >
                      ORDER NUMBER
                    </div>

                    <div
                      style="
                        margin-top: 5px;
                        color: #005c2e;
                        font-size: 18px;
                        font-weight: bold;
                      "
                    >
                      #${orderNumber}
                    </div>

                  </td>
                </tr>

              </table>

            </td>
          </tr>

          <!-- =========================================
               ORDER DETAILS
          ========================================== -->

          <tr>
            <td
              style="
                padding: 0 30px 20px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td
                    width="50%"
                    style="
                      padding: 0 10px 0 0;
                      vertical-align: top;
                    "
                  >

                    <div
                      style="
                        color: #888888;
                        font-size: 11px;
                        margin-bottom: 5px;
                      "
                    >
                      PAYMENT METHOD
                    </div>

                    <div
                      style="
                        color: #222222;
                        font-size: 13px;
                        font-weight: 600;
                        text-transform: capitalize;
                      "
                    >
                      ${paymentMethod}
                    </div>

                  </td>

                  <td
                    width="50%"
                    align="right"
                    style="
                      padding: 0 0 0 10px;
                      vertical-align: top;
                    "
                  >

                    <div
                      style="
                        color: #888888;
                        font-size: 11px;
                        margin-bottom: 5px;
                      "
                    >
                      PAYMENT STATUS
                    </div>

                    <div
                      style="
                        color: #005c2e;
                        font-size: 13px;
                        font-weight: 600;
                      "
                    >
                      ${paymentStatus}
                    </div>

                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- =========================================
               ITEMS
          ========================================== -->

          <tr>
            <td
              style="
                padding: 0 30px;
              "
            >

              <h2
                style="
                  margin: 0 0 10px;
                  color: #222222;
                  font-size: 18px;
                  line-height: 24px;
                "
              >
                Your Items
              </h2>

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                ${itemsHtml}

              </table>

            </td>
          </tr>

          <!-- =========================================
               TOTALS
          ========================================== -->

          <tr>
            <td
              style="
                padding: 25px 30px 5px;
              "
            >

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td
                    style="
                      padding: 8px 0;
                      color: #666666;
                      font-size: 14px;
                    "
                  >
                    Subtotal
                  </td>

                  <td
                    align="right"
                    style="
                      padding: 8px 0;
                      color: #222222;
                      font-size: 14px;
                      font-weight: 600;
                    "
                  >
                    ${subtotalSSP}
                  </td>

                </tr>

                <tr>

                  <td
                    style="
                      padding: 15px 0 8px;
                      border-top: 1px solid #dddddd;
                      color: #222222;
                      font-size: 17px;
                      font-weight: bold;
                    "
                  >
                    Total
                  </td>

                  <td
                    align="right"
                    style="
                      padding: 15px 0 8px;
                      border-top: 1px solid #dddddd;
                      color: #005c2e;
                      font-size: 18px;
                      font-weight: bold;
                      white-space: nowrap;
                    "
                  >
                    ${totalSSP}
                  </td>

                </tr>

              </table>

            </td>
          </tr>

          <!-- =========================================
               EXCHANGE RATE
          ========================================== -->

          <tr>
            <td
              align="right"
              style="
                padding: 5px 30px 25px;
              "
            >

              <span
                style="
                  color: #999999;
                  font-size: 11px;
                "
              >
                1 USD = ${exchangeRate.toLocaleString(
                  "en-US",
                )} SSP
              </span>

            </td>
          </tr>

          <!-- =========================================
               TRACK ORDER
          ========================================== -->

          <tr>
            <td
              align="center"
              style="
                padding: 5px 30px 35px;
              "
            >

              <a
                href="${trackingUrl}"
                style="
                  display: inline-block;
                  padding: 13px 28px;
                  background: #005c2e;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 7px;
                  font-size: 14px;
                  font-weight: bold;
                "
              >
                Track Your Order
              </a>

              <p
                style="
                  margin: 16px 0 0;
                  color: #888888;
                  font-size: 12px;
                  line-height: 20px;
                "
              >
                You can use your order number
                to check your order status anytime.
              </p>

            </td>
          </tr>

          <!-- =========================================
               FOOTER
          ========================================== -->

          <tr>
            <td
              align="center"
              style="
                padding: 24px 30px;
                background: #f7f8f7;
                border-top: 1px solid #eeeeee;
              "
            >

              <p
                style="
                  margin: 0 0 6px;
                  color: #005c2e;
                  font-size: 15px;
                  font-weight: bold;
                "
              >
                Africa Suk
              </p>

              <p
                style="
                  margin: 0;
                  color: #888888;
                  font-size: 12px;
                  line-height: 20px;
                "
              >
                Shop with Confidence.
              </p>

              <p
                style="
                  margin: 12px 0 0;
                  color: #aaaaaa;
                  font-size: 11px;
                  line-height: 18px;
                "
              >
                This is an automatic order
                confirmation email.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>

  </table>

</body>
</html>
`;

    // --------------------------------------------------
    // Send
    // --------------------------------------------------

    await sendEmail({
      to: customerEmail,
      subject: `Africa Suk Order Confirmed #${order.orderNumber}`,
      htmlbody,
    });

    console.log(
      "Order confirmation email sent:",
      order.orderNumber,
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
        error:
          error instanceof Error
            ? error.message
            : "Failed to send order confirmation email.",
      },
      { status: 500 },
    );
  }
}