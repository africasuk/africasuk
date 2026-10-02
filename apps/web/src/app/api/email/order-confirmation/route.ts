import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/zeptomail";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      order,
      customer,
      items,
    } = body;

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

    const customerName =
      customer.name?.trim() ||
      customer.email.split("@")[0];

    const itemsHtml = items
      .map(
        (item: {
          name: string;
          price: number;
          quantity: number;
        }) => `
          <tr>
            <td style="padding: 10px 0;">
              ${item.name}
            </td>

            <td
              style="
                padding: 10px 0;
                text-align: center;
              "
            >
              ${item.quantity}
            </td>

            <td
              style="
                padding: 10px 0;
                text-align: right;
              "
            >
              ${item.price}
            </td>
          </tr>
        `,
      )
      .join("");

    const htmlbody = `
      <!DOCTYPE html>

      <html>
        <body
          style="
            margin: 0;
            padding: 0;
            background: #f5f5f5;
            font-family: Arial, sans-serif;
            color: #222;
          "
        >
          <div
            style="
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              padding: 32px;
              border-radius: 12px;
            "
          >
            <h2
              style="
                margin-top: 0;
                color: #005c2e;
              "
            >
              Thank you for your order!
            </h2>

            <p>
              Hello ${customerName},
            </p>

            <p>
              Thank you for shopping with
              <strong>AfricaSuk</strong>.
              We have received your order.
            </p>

            <div
              style="
                margin: 24px 0;
                padding: 16px;
                background: #f7f7f7;
                border-radius: 8px;
              "
            >
              <strong>Order Number</strong>

              <div
                style="
                  margin-top: 6px;
                  font-size: 18px;
                "
              >
                #${order.orderNumber}
              </div>
            </div>

            <h3>Order Items</h3>

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="
                border-collapse: collapse;
              "
            >
              <thead>
                <tr>
                  <th
                    style="
                      text-align: left;
                      padding-bottom: 10px;
                    "
                  >
                    Product
                  </th>

                  <th
                    style="
                      text-align: center;
                      padding-bottom: 10px;
                    "
                  >
                    Qty
                  </th>

                  <th
                    style="
                      text-align: right;
                      padding-bottom: 10px;
                    "
                  >
                    Price
                  </th>
                </tr>
              </thead>

              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <hr
              style="
                border: none;
                border-top: 1px solid #eee;
                margin: 24px 0;
              "
            />

            <p>
              <strong>Total:</strong>
              ${order.total} ${order.currency}
            </p>

            <p>
              We appreciate your support and look
              forward to serving you.
            </p>

            <p>
              Thank you for choosing AfricaSuk.
            </p>
          </div>
        </body>
      </html>
    `;

    await sendEmail({
      to: customer.email.trim().toLowerCase(),

      subject:
        `Thank you for your AfricaSuk order #${order.orderNumber}`,

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