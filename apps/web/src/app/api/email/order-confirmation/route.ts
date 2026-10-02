import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/zeptomail";

function formatSSP(value: number) {
  return `${Number(value || 0).toLocaleString("en-US")} SSP`;
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
            <td
              style="
                padding: 14px 0;
                border-bottom: 1px solid #eeeeee;
                color: #222222;
                font-size: 14px;
              "
            >
              ${escapeHtml(item.name)}
            </td>

            <td
              style="
                padding: 14px 8px;
                border-bottom: 1px solid #eeeeee;
                text-align: center;
                color: #666666;
                font-size: 14px;
              "
            >
              ${item.quantity}
            </td>

            <td
              style="
                padding: 14px 0;
                border-bottom: 1px solid #eeeeee;
                text-align: right;
                color: #222222;
                font-size: 14px;
                font-weight: 600;
              "
            >
              ${formatSSP(item.price * item.quantity)}
            </td>
          </tr>
        `,
      )
      .join("");

    const trackingUrl = `https://www.africasuk.com/track/${encodeURIComponent(
      order.orderNumber,
    )}`;

    const htmlbody = `
      <!DOCTYPE html>

      <html>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta charset="UTF-8" />
          <title>AfricaSuk Order Confirmation</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background: #f3f5f4;
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
              background: #f3f5f4;
              padding: 32px 12px;
            "
          >
            <tr>
              <td align="center">

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    max-width: 620px;
                    background: #ffffff;
                    border-radius: 14px;
                    overflow: hidden;
                  "
                >

                  <!-- HEADER -->

                  <tr>
                    <td
                      style="
                        background: #005c2e;
                        padding: 28px 30px;
                        text-align: center;
                      "
                    >

                      <img
                        src="https://www.africasuk.com/Newlogo.png"
                        alt="AfricaSuk"
                        width="150"
                        style="
                          display: block;
                          margin: 0 auto;
                          max-width: 150px;
                          height: auto;
                        "
                      />

                    </td>
                  </tr>

                  <!-- CONTENT -->

                  <tr>
                    <td
                      style="
                        padding: 36px 30px;
                      "
                    >

                      <!-- SUCCESS ICON -->

                      <div
                        style="
                          width: 54px;
                          height: 54px;
                          margin: 0 auto 18px;
                          background: #e8f5ed;
                          border-radius: 50%;
                          text-align: center;
                          line-height: 54px;
                          color: #005c2e;
                          font-size: 26px;
                          font-weight: bold;
                        "
                      >
                        ✓
                      </div>

                      <h1
                        style="
                          margin: 0;
                          text-align: center;
                          color: #005c2e;
                          font-size: 26px;
                          line-height: 34px;
                        "
                      >
                        Order Confirmed
                      </h1>

                      <p
                        style="
                          margin: 10px 0 0;
                          text-align: center;
                          color: #666666;
                          font-size: 15px;
                          line-height: 24px;
                        "
                      >
                        Thank you for shopping with AfricaSuk.
                        We've received your order successfully.
                      </p>

                      <!-- ORDER NUMBER -->

                      <div
                        style="
                          margin: 28px 0;
                          padding: 18px;
                          background: #f5f8f6;
                          border: 1px solid #e2ebe5;
                          border-radius: 10px;
                          text-align: center;
                        "
                      >

                        <div
                          style="
                            color: #777777;
                            font-size: 12px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                          "
                        >
                          Order Number
                        </div>

                        <div
                          style="
                            margin-top: 7px;
                            color: #005c2e;
                            font-size: 21px;
                            font-weight: bold;
                          "
                        >
                          #${escapeHtml(order.orderNumber)}
                        </div>

                      </div>

                      <!-- CUSTOMER -->

                      <h2
                        style="
                          margin: 0 0 12px;
                          font-size: 17px;
                          color: #222222;
                        "
                      >
                        Hello ${escapeHtml(customerName)},
                      </h2>

                      <p
                        style="
                          margin: 0 0 24px;
                          color: #555555;
                          font-size: 14px;
                          line-height: 23px;
                        "
                      >
                        Your order has been received and is now
                        being prepared. We'll keep you updated as
                        your order moves through the process.
                      </p>

                      <!-- ITEMS -->

                      <h2
                        style="
                          margin: 0 0 14px;
                          font-size: 17px;
                          color: #222222;
                        "
                      >
                        Your Order
                      </h2>

                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                          border-collapse: collapse;
                        "
                      >

                        <thead>
                          <tr>
                            <th
                              style="
                                padding: 0 0 10px;
                                text-align: left;
                                color: #777777;
                                font-size: 12px;
                                font-weight: 600;
                                text-transform: uppercase;
                              "
                            >
                              Product
                            </th>

                            <th
                              style="
                                padding: 0 8px 10px;
                                text-align: center;
                                color: #777777;
                                font-size: 12px;
                                font-weight: 600;
                                text-transform: uppercase;
                              "
                            >
                              Qty
                            </th>

                            <th
                              style="
                                padding: 0 0 10px;
                                text-align: right;
                                color: #777777;
                                font-size: 12px;
                                font-weight: 600;
                                text-transform: uppercase;
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

                      <!-- TOTALS -->

                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                          margin-top: 18px;
                        "
                      >

                        <tr>
                          <td
                            style="
                              padding: 5px 0;
                              color: #777777;
                              font-size: 14px;
                            "
                          >
                            Subtotal
                          </td>

                          <td
                            style="
                              padding: 5px 0;
                              text-align: right;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            ${formatSSP(order.subtotal)}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style="
                              padding: 5px 0;
                              color: #777777;
                              font-size: 14px;
                            "
                          >
                            Shipping
                          </td>

                          <td
                            style="
                              padding: 5px 0;
                              text-align: right;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            ${formatSSP(order.shipping)}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style="
                              padding: 5px 0;
                              color: #777777;
                              font-size: 14px;
                            "
                          >
                            Tax
                          </td>

                          <td
                            style="
                              padding: 5px 0;
                              text-align: right;
                              color: #333333;
                              font-size: 14px;
                            "
                          >
                            ${formatSSP(order.tax)}
                          </td>
                        </tr>

                        <tr>
                          <td
                            colspan="2"
                            style="
                              padding-top: 14px;
                              border-top: 1px solid #eeeeee;
                            "
                          ></td>
                        </tr>

                        <tr>
                          <td
                            style="
                              color: #222222;
                              font-size: 17px;
                              font-weight: bold;
                            "
                          >
                            Total
                          </td>

                          <td
                            style="
                              text-align: right;
                              color: #005c2e;
                              font-size: 20px;
                              font-weight: bold;
                            "
                          >
                            ${formatSSP(order.total)}
                          </td>
                        </tr>

                      </table>

                      <!-- TRACK BUTTON -->

                      <div
                        style="
                          margin: 30px 0 10px;
                          text-align: center;
                        "
                      >

                        <a
                          href="${trackingUrl}"
                          style="
                            display: inline-block;
                            padding: 13px 25px;
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

                      </div>

                      <p
                        style="
                          margin: 18px 0 0;
                          text-align: center;
                          color: #888888;
                          font-size: 12px;
                          line-height: 20px;
                        "
                      >
                        You can use your order number to check
                        your order status anytime.
                      </p>

                    </td>
                  </tr>

                  <!-- FOOTER -->

                  <tr>
                    <td
                      style="
                        padding: 24px 30px;
                        background: #f7f8f7;
                        border-top: 1px solid #eeeeee;
                        text-align: center;
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
                        AfricaSuk
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
                        "
                      >
                        This is an automatic order confirmation
                        email. Please do not reply to this email.
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

    await sendEmail({
      to: customer.email.trim().toLowerCase(),

      subject:
        `AfricaSuk Order Confirmed #${order.orderNumber}`,

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