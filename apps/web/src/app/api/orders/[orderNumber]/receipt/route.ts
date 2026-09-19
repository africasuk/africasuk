import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/zeptomail";
import { getOrder } from "@/actions/orders";
import { createClient } from "@/lib/auth/server";

interface Props {
  params: Promise<{
    orderNumber: string;
  }>;
}

export async function POST(request: Request, { params }: Props) {
  try {
    const { orderNumber } = await params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const result = await getOrder(orderNumber);

    if (!result) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const { order, items } = result;

    // Make sure this order belongs to the logged-in customer.
    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: "You are not authorized to access this order." },
        { status: 403 }
      );
    }

    if (order.status?.toUpperCase() !== "DELIVERED") {
      return NextResponse.json(
        { error: "Receipt is only available for delivered orders." },
        { status: 400 }
      );
    }

    // Use the email stored on the order first.
    const email =
      order.customerEmail ||
      user.email;

    if (!email) {
      return NextResponse.json(
        { error: "No customer email address is available." },
        { status: 400 }
      );
    }

    const customerName =
      order.customerName || email.split("@")[0];

    const itemsHtml = items
      .map(({ item, product, variant }) => {
        const productName = product?.name || item.name;

        const variantText = variant?.optionValue
          ? `${variant.optionName || "Option"}: ${variant.optionValue}`
          : "";

        const unitPrice = Number(item.price);
        const quantity = Number(item.quantity);
        const total = unitPrice * quantity;

        return `
          <tr>
            <td style="
              padding:14px 8px;
              border-bottom:1px solid #eeeeee;
              color:#111111;
            ">
              <div style="font-weight:700;">
                ${productName}
              </div>

              ${
                variantText
                  ? `
                    <div style="
                      margin-top:4px;
                      color:#777777;
                      font-size:12px;
                    ">
                      ${variantText}
                    </div>
                  `
                  : ""
              }
            </td>

            <td style="
              padding:14px 8px;
              border-bottom:1px solid #eeeeee;
              text-align:center;
              color:#555555;
            ">
              ${quantity}
            </td>

            <td style="
              padding:14px 8px;
              border-bottom:1px solid #eeeeee;
              text-align:right;
              font-weight:700;
              color:#111111;
            ">
              $${total.toFixed(2)}
            </td>
          </tr>
        `;
      })
      .join("");

    const trackingUrl =
      `https://africasuk.com/track/${order.orderNumber}`;

    const subject =
      `Africa Suk Receipt — Order #${order.orderNumber}`;

    await sendEmail({
      to: email,
      subject,
      htmlbody: `
        <div style="
          margin:0;
          padding:40px 15px;
          background:#f5f7f6;
          font-family:Arial,Helvetica,sans-serif;
        ">

          <div style="
            max-width:650px;
            margin:0 auto;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            border:1px solid #e5e7eb;
          ">

            <!-- HEADER -->

            <div style="
              padding:32px 30px;
              border-bottom:3px solid #005c2e;
            ">

              <div style="
                font-size:28px;
                font-weight:900;
                color:#005c2e;
                letter-spacing:-0.5px;
              ">
                AFRICA SUK
              </div>

              <div style="
                margin-top:5px;
                color:#777777;
                font-size:12px;
                font-weight:700;
                letter-spacing:1.5px;
                text-transform:uppercase;
              ">
                Shop with Confidence
              </div>

            </div>

            <!-- TITLE -->

            <div style="
              padding:28px 30px 10px;
            ">

              <h1 style="
                margin:0;
                color:#111111;
                font-size:24px;
              ">
                Order Receipt
              </h1>

              <p style="
                margin:8px 0 0;
                color:#777777;
                font-size:14px;
              ">
                Thank you for shopping with Africa Suk, ${customerName}.
              </p>

            </div>

            <!-- ORDER INFORMATION -->

            <div style="
              margin:20px 30px;
              padding:18px 0;
              border-top:1px solid #eeeeee;
              border-bottom:1px solid #eeeeee;
            ">

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

                  <td style="
                    padding:5px 0;
                    text-align:right;
                    font-weight:700;
                    color:#111111;
                  ">
                    #${order.orderNumber}
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Order Date
                  </td>

                  <td style="
                    padding:5px 0;
                    text-align:right;
                    color:#111111;
                  ">
                    ${new Date(order.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Payment
                  </td>

                  <td style="
                    padding:5px 0;
                    text-align:right;
                    font-weight:700;
                    color:#111111;
                    text-transform:uppercase;
                  ">
                    ${
                      order.paymentMethod ||
                      "Cash on Delivery"
                    }
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Status
                  </td>

                  <td style="
                    padding:5px 0;
                    text-align:right;
                    font-weight:700;
                    color:#166534;
                  ">
                    PAID & DELIVERED
                  </td>
                </tr>

              </table>

            </div>

            <!-- ITEMS -->

            <div style="
              padding:0 30px;
            ">

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
                  <tr style="
                    background:#f5f5f5;
                  ">

                    <th style="
                      padding:11px 8px;
                      text-align:left;
                      color:#555555;
                      font-size:11px;
                      text-transform:uppercase;
                    ">
                      Item
                    </th>

                    <th style="
                      padding:11px 8px;
                      text-align:center;
                      color:#555555;
                      font-size:11px;
                      text-transform:uppercase;
                    ">
                      Qty
                    </th>

                    <th style="
                      padding:11px 8px;
                      text-align:right;
                      color:#555555;
                      font-size:11px;
                      text-transform:uppercase;
                    ">
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

            <div style="
              margin:25px 30px 0;
              padding:20px;
              background:#f7f7f8;
              border-radius:10px;
            ">

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

                  <td style="
                    padding:5px 0;
                    text-align:right;
                  ">
                    $${Number(order.subtotal).toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Shipping & Logistics
                  </td>

                  <td style="
                    padding:5px 0;
                    text-align:right;
                  ">
                    $${Number(order.shipping).toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td style="padding:5px 0;">
                    Tax & Duties
                  </td>

                  <td style="
                    padding:5px 0;
                    text-align:right;
                  ">
                    $${Number(order.tax).toFixed(2)}
                  </td>
                </tr>

                <tr>
                  <td colspan="2" style="
                    padding-top:14px;
                    border-top:2px solid #111111;
                  ">
                  </td>
                </tr>

                <tr>
                  <td style="
                    font-size:18px;
                    font-weight:900;
                    color:#111111;
                  ">
                    Total Paid
                  </td>

                  <td style="
                    text-align:right;
                    font-size:18px;
                    font-weight:900;
                    color:#005c2e;
                  ">
                    $${Number(order.total).toFixed(2)}
                  </td>
                </tr>

              </table>

            </div>

            <!-- TRACKING -->

            <div style="
              padding:30px;
              text-align:center;
            ">

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

              <p style="
                margin:15px 0 0;
                color:#777777;
                font-size:12px;
              ">
                Your order has been successfully delivered.
              </p>

            </div>

            <!-- FOOTER -->

            <div style="
              padding:25px 30px;
              border-top:1px solid #eeeeee;
              text-align:center;
              color:#777777;
              font-size:12px;
              line-height:1.6;
            ">

              <strong style="color:#005c2e;">
                Africa Suk
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
    console.error("Receipt email error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to send receipt.",
      },
      { status: 500 }
    );
  }
}