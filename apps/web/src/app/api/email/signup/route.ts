import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/zeptomail";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const recipientEmail = email.trim().toLowerCase();
    const displayName =
      name?.trim() || recipientEmail.split("@")[0];

    await sendEmail({
      to: recipientEmail,
      subject: "Welcome to AfricaSuk",
      htmlbody: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <title>Welcome to AfricaSuk</title>
          </head>

          <body
            style="
              margin:0;
              padding:0;
              background:#f4f6f5;
              font-family:Arial,Helvetica,sans-serif;
              color:#111827;
            "
          >
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="background:#f4f6f5;"
            >
              <tr>
                <td align="center" style="padding:48px 20px;">

                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="
                      max-width:620px;
                      background:#ffffff;
                      border:1px solid #e5e7eb;
                      border-radius:18px;
                      overflow:hidden;
                    "
                  >

                    <!-- Brand Header -->
                    <tr>
                      <td
                        align="center"
                        style="
                          padding:34px 32px 28px;
                          border-bottom:1px solid #f0f1f1;
                        "
                      >
                        <img
                          src="https://www.africasuk.com/Newlogo.png"
                          alt="AfricaSuk"
                          width="150"
                          style="
                            display:block;
                            width:150px;
                            max-width:150px;
                            height:auto;
                            border:0;
                          "
                        />
                      </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                      <td style="padding:42px 40px 36px;">

                        <p
                          style="
                            margin:0 0 12px;
                            color:#004d26;
                            font-size:12px;
                            font-weight:700;
                            letter-spacing:1.4px;
                            text-transform:uppercase;
                          "
                        >
                          Welcome to AfricaSuk
                        </p>

                        <h1
                          style="
                            margin:0 0 18px;
                            color:#111827;
                            font-size:30px;
                            line-height:1.25;
                            font-weight:700;
                            letter-spacing:-0.5px;
                          "
                        >
                          Welcome, ${displayName}.
                        </h1>

                        <p
                          style="
                            margin:0 0 18px;
                            color:#4b5563;
                            font-size:15px;
                            line-height:1.8;
                          "
                        >
                          Your AfricaSuk account is now ready.
                          We're making it easier to discover and shop
                          for products that can be difficult to find locally.
                        </p>

                        <p
                          style="
                            margin:0;
                            color:#4b5563;
                            font-size:15px;
                            line-height:1.8;
                          "
                        >
                          From everyday essentials to hard-to-find
                          products, AfricaSuk brings your shopping
                          experience together in one place.
                        </p>

                        <!-- CTA -->
                        <table
                          role="presentation"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                          border="0"
                          style="margin-top:34px;"
                        >
                          <tr>
                            <td>
                              <a
                                href="https://www.africasuk.com"
                                style="
                                  display:inline-block;
                                  background:#004d26;
                                  color:#ffffff;
                                  text-decoration:none;
                                  padding:14px 26px;
                                  border-radius:9px;
                                  font-size:14px;
                                  font-weight:700;
                                "
                              >
                                Explore AfricaSuk
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Brand Message -->
                        <div
                          style="
                            margin-top:36px;
                            padding:18px 20px;
                            background:#f3f8f5;
                            border-left:3px solid #004d26;
                            border-radius:6px;
                          "
                        >
                          <p
                            style="
                              margin:0;
                              color:#004d26;
                              font-size:14px;
                              line-height:1.6;
                              font-weight:600;
                            "
                          >
                            Shop with confidence.
                          </p>

                          <p
                            style="
                              margin:4px 0 0;
                              color:#5f6f66;
                              font-size:12px;
                              line-height:1.6;
                            "
                          >
                            AfricaSuk is here to make online shopping
                            simpler and more accessible.
                          </p>
                        </div>

                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td
                        style="
                          padding:26px 40px 32px;
                          background:#fafafa;
                          border-top:1px solid #eeeeee;
                        "
                      >

                        <p
                          style="
                            margin:0 0 10px;
                            color:#111827;
                            font-size:13px;
                            font-weight:700;
                          "
                        >
                          AfricaSuk
                        </p>

                        <p
                          style="
                            margin:0 0 14px;
                            color:#6b7280;
                            font-size:12px;
                            line-height:1.7;
                          "
                        >
                          Shop with confidence.
                        </p>

                        <p
                          style="
                            margin:0;
                            font-size:12px;
                            line-height:1.7;
                          "
                        >
                          <a
                            href="https://www.africasuk.com"
                            style="
                              color:#004d26;
                              text-decoration:none;
                              font-weight:600;
                            "
                          >
                            www.africasuk.com
                          </a>
                          &nbsp;&nbsp;·&nbsp;&nbsp;
                          <a
                            href="mailto:support@africasuk.com"
                            style="
                              color:#004d26;
                              text-decoration:none;
                              font-weight:600;
                            "
                          >
                            support@africasuk.com
                          </a>
                        </p>

                        <p
                          style="
                            margin:20px 0 0;
                            color:#9ca3af;
                            font-size:11px;
                            line-height:1.6;
                          "
                        >
                          If you did not create this account, you can
                          safely ignore this email.
                        </p>

                      </td>
                    </tr>

                  </table>

                  <p
                    style="
                      margin:20px 0 0;
                      color:#9ca3af;
                      font-size:11px;
                      text-align:center;
                    "
                  >
                    © AfricaSuk. All rights reserved.
                  </p>

                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup welcome email error:", error);

    return NextResponse.json(
      { error: "Failed to send signup email." },
      { status: 500 },
    );
  }
}