import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/zeptomail";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const displayName = name || email.split("@")[0];

    await sendEmail({
      to: email,
      subject: `Welcome to AfricaSuk 🌍`,
      htmlbody: `
        <div style="font-family: Arial, sans-serif; background:#f5f7f6; padding:40px 20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:16px; padding:40px;">

            <div style="text-align:center; margin-bottom:32px;">
              <img
                src="https://africasuk.com/logo.png"
                alt="AfricaSuk"
                style="width:160px;"
              />
            </div>

            <h2 style="color:#111111; margin-bottom:16px;">
              Welcome to AfricaSuk, ${displayName}! 🌍
            </h2>

            <p style="color:#555555; line-height:1.7;">
              Your AfricaSuk account is ready.
            </p>

            <p style="color:#555555; line-height:1.7;">
              Discover products that are hard to find locally, all in one place.
              We're here to make shopping simpler.
            </p>

            <div style="text-align:center; margin:32px 0;">
              <a
                href="https://www.africasuk.com"
                style="
                  display:inline-block;
                  background:#004d26;
                  color:#ffffff;
                  text-decoration:none;
                  padding:14px 28px;
                  border-radius:10px;
                  font-weight:bold;
                "
              >
                Start Shopping
              </a>
            </div>

            <p style="color:#004d26; font-weight:bold;">
              Shop with confidence.
            </p>

            <hr style="border:0; border-top:1px solid #eeeeee; margin:32px 0;" />

            <p style="color:#777777; font-size:13px; line-height:1.6;">
              If you didn't create this account, you can safely ignore this email.
            </p>

            <p style="color:#555555; margin-top:32px;">
              <strong>AfricaSuk</strong><br />
              <a href="https://www.africasuk.com" style="color:#004d26;">
                www.africasuk.com
              </a>
            </p>

          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Signup email error:", error);

    return NextResponse.json(
      { error: "Failed to send signup email" },
      { status: 500 }
    );
  }
}