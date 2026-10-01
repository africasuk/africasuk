import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/zeptomail";
import { getOrder } from "@/actions/orders";
import { createClient } from "@/lib/auth/server";

interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

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

export async function POST(
  request: Request,
  { params }: Props,
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Order number is required.",
        },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be logged in.",
        },
        { status: 401 },
      );
    }

    const result = await getOrder(orderNumber);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found.",
        },
        { status: 404 },
      );
    }

    const { order, items } = result;

    // Make sure this order belongs to the logged-in customer.
    if (order.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You are not authorized to access this order.",
        },
        { status: 403 },
      );
    }

    // Receipt can be sent for any order.
    // Do not restrict it to DELIVERED orders.

    const email =
      order.customerEmail || user.email;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No customer email address is available.",
        },
        { status: 400 },
      );
    }

    const customerName =
      order.customerName ||
      email.split("@")[0];

    const itemsHtml = items
      .map(({ item, product, variant }) => {
        const productName =
          product?.name || item.name;

        const variantText =
          variant?.optionValue
            ? `${
                variant.optionName ||
                "Option"
              }: ${variant.optionValue}`
            : "";

        const unitPrice = Number(item.price);
        const quantity = Number(item.quantity);
        const total = unitPrice * quantity;

        return `
          <tr>
            <td
              style="
                padding:14px 8px;
                border-bottom:1px solid #eeeeee;
                color:#111111;
              "
            >
              <div style="font-weight:700;">
                ${productName}
              </div>

              ${
                variantText
                  ? `
                    <div
                      style="
                        margin-top:4px;
                        color:#777777;
                        font-size:12px;
                      "
                    >
                      ${variantText}
                    </div>
                  `
                  : ""
              }
            </td>

            <td
              style="
                padding:14px 8px;
                border-bottom:1px solid #eeeeee;
                text-align:center;
                color:#555555;
              "
            >
              ${quantity}
            </td>

            <td
              style="
                padding:14px 8px;
                border-bottom:1px solid #eeeeee;
                text-align:right;
                font-weight:700;
                color:#111111;
              "
            >
              $${total.toFixed(2)}
            </td>
          </tr>
        `;
      })
      .join("");

    const trackingUrl =
      `https://www.africasuk.com/track/${order.orderNumber}`;

    const qrCodeUrl =
      `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(
        trackingUrl,
      )}`;

    const subject =
      `AfricaSuk Receipt — Order #${order.orderNumber}`;

    await sendEmail({
      to: email,
      subject,
      htmlbody: `
        <div
          style="
            margin:0;
            padding:40px 15px;
            background:#f5f7f6;
            font-family:Arial,Helvetica,sans-serif;
          "
        >
          <div
            style="
              max-width:650px;
              margin:0 auto;
              background:#ffffff;
              border-radius:16px;
              overflow:hidden;
              border:1px solid #e5e7eb;
            "
          >

            <!-- HEADER -->
            <div
              style="
                padding:32px 30px;
                border-bottom:3px solid #005c2e;
                text-align:center;
              "
            >
              <img
                src="https://www.africasuk.com/Newlogo.png"
                alt="AfricaSuk"
                width="180"
                style="
                  display:block;
                  width:180px;
                  max-width:100%;
                  height:auto;
                  margin:0 auto;
                "
              />

              <div
                style="
                  margin-top:8px;
                  color:#777777;
                  font-size:12px;
                  font-weight:700;
                  letter-spacing:1.5px;
                  text-transform:uppercase;
                "
              >
                Shop with Confidence
              </div>
            </div>

            <!-- TITLE -->
            <div
              style="
                padding:28px 30px 10px;
              "
            >
              <h1
                style="
                  margin:0;
                  color:#111111;
                  font-size:24px;
                "
              >
                Order Receipt
              </h1>

              <p
                style="
                  margin:8px 0 0;
                  color:#777777;
                  font-size:14px;
                "
              >
                Thank you for shopping with
                AfricaSuk, ${customerName}.
              </p>
            </div>

            <!-- ORDER INFORMATION -->
            <div
              style="
                margin:20px 30px;
                padding:18px 0;
                border-top:1px solid #eeeeee;
                border-bottom:1px solid #eeeeee;
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  font-size:13px;
                  color:#555555;
                "
              >
                <tr>
                  <td style="padding:5px 0;">
                    Order Number
                  </td>

                  <td
                    style="
                      padding:5px 0;
                      text-align:right;
                      font-weight:700;
                      color:#111111;
                    "
                  >
                    #${order.orderNumber}
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Order Date
                  </td>

                  <td
                    style="
                      padding:5px 0;
                      text-align:right;
                      color:#111111;
                    "
                  >
                    ${formatDate(order.createdAt)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Payment
                  </td>

                  <td
                    style="
                      padding:5px 0;
                      text-align:right;
                      font-weight:700;
                      color:#111111;
                      text-transform:uppercase;
                    "
                  >
                    ${
                      order.paymentMethod ||
                      "Cash on Delivery"
                    }
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Order Status
                  </td>

                  <td
                    style="
                      padding:5px 0;
                      text-align:right;
                      font-weight:700;
                      color:#005c2e;
                      text-transform:uppercase;
                    "
                  >
                    ${order.status}
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Payment Status
                  </td>

                  <td
                    style="
                      padding:5px 0;
                      text-align:right;
                      font-weight:700;
                      color:#005c2e;
                      text-transform:uppercase;
                    "
                  >
                    ${order.paymentStatus}
                  </td>
                </tr>
              </table>
            </div>

            <!-- CUSTOMER -->
            <div
              style="
                padding:0 30px 25px;
              "
            >
              <h2
                style="
                  margin:0 0 10px;
                  font-size:14px;
                  color:#111111;
                "
              >
                Customer
              </h2>

              <div
                style="
                  color:#555555;
                  font-size:13px;
                  line-height:1.7;
                "
              >
                <div>${customerName}</div>

                ${
                  order.customerPhone
                    ? `<div>${order.customerPhone}</div>`
                    : ""
                }

                <div>${email}</div>
              </div>
            </div>

            <!-- ITEMS -->
            <div
              style="
                padding:0 30px;
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse:collapse;
                  font-size:13px;
                "
              >
                <thead>
                  <tr
                    style="
                      background:#f5f5f5;
                    "
                  >
                    <th
                      style="
                        padding:11px 8px;
                        text-align:left;
                        color:#555555;
                        font-size:11px;
                        text-transform:uppercase;
                      "
                    >
                      Item
                    </th>

                    <th
                      style="
                        padding:11px 8px;
                        text-align:center;
                        color:#555555;
                        font-size:11px;
                        text-transform:uppercase;
                      "
                    >
                      Qty
                    </th>

                    <th
                      style="
                        padding:11px 8px;
                        text-align:right;
                        color:#555555;
                        font-size:11px;
                        text-transform:uppercase;
                      "
                    >
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>

            <!-- TOTALS -->
            <div
              style="
                margin:25px 30px 0;
                padding:20px;
                background:#f7f7f8;
                border-radius:10px;
              "
            >
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                style="
                  font-size:13px;
                  color:#555555;
                "
              >
                <tr>
                  <td style="padding:5px 0;">
                    Subtotal
                  </td>

                  <td
                    style="
                      padding:5px 0;
                      text-align:right;
                    "
                  >
                    $${Number(
                      order.subtotal,
                    ).toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Shipping & Logistics
                  </td>

                  <td
                    style="
                      padding:5px 0;
                      text-align:right;
                    "
                  >
                    $${Number(
                      order.shipping,
                    ).toFixed(2)}
                  </td>
                </tr>

                ${
                  Number(order.tax) > 0
                    ? `
                      <tr>
                        <td style="padding:5px 0;">
                          Tax
                        </td>

                        <td
                          style="
                            padding:5px 0;
                            text-align:right;
                          "
                        >
                          $${Number(
                            order.tax,
                          ).toFixed(2)}
                        </td>
                      </tr>
                    `
                    : ""
                }

                ${
                  Number(order.discount) > 0
                    ? `
                      <tr>
                        <td style="padding:5px 0;">
                          Discount
                        </td>

                        <td
                          style="
                            padding:5px 0;
                            text-align:right;
                          "
                        >
                          -$${Number(
                            order.discount,
                          ).toFixed(2)}
                        </td>
                      </tr>
                    `
                    : ""
                }

                <tr>
                  <td
                    colspan="2"
                    style="
                      padding-top:14px;
                      border-top:2px solid #111111;
                    "
                  ></td>
                </tr>

                <tr>
                  <td
                    style="
                      font-size:18px;
                      font-weight:900;
                      color:#111111;
                    "
                  >
                    Total
                  </td>

                  <td
                    style="
                      text-align:right;
                      font-size:18px;
                      font-weight:900;
                      color:#005c2e;
                    "
                  >
                    $${Number(
                      order.total,
                    ).toFixed(2)}
                  </td>
                </tr>
              </table>
            </div>

            <!-- TRACKING -->
            <div
              style="
                padding:30px;
                text-align:center;
              "
            >
              <img
                src="${qrCodeUrl}"
                alt="Order tracking QR code"
                width="160"
                height="160"
                style="
                  display:block;
                  width:160px;
                  height:160px;
                  margin:0 auto 15px;
                "
              />

              <p
                style="
                  margin:0 0 15px;
                  color:#777777;
                  font-size:12px;
                "
              >
                Scan to track your order
              </p>

              <a
                href="${trackingUrl}"
                style="
                  display:inline-block;
                  padding:13px 24px;
                  background:#005c2e;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:8px;
                  font-size:13px;
                  font-weight:700;
                "
              >
                Track Your Order
              </a>
            </div>

            <!-- FOOTER -->
            <div
              style="
                padding:25px 30px;
                border-top:1px solid #eeeeee;
                text-align:center;
                color:#777777;
                font-size:12px;
                line-height:1.6;
              "
            >
              <strong style="color:#005c2e;">
                AfricaSuk
              </strong>

              <br />

              Shop with Confidence.

              <br />

              <a
                href="https://www.africasuk.com"
                style="color:#005c2e;"
              >
                www.africasuk.com
              </a>

              <br />

              support@africasuk.com
            </div>

          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Receipt sent successfully.",
    });
  } catch (error) {
    console.error(
      "Receipt email error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 },
    );
  }
}