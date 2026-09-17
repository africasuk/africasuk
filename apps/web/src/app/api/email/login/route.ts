import { sendEmail } from "@/lib/zeptomail";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await sendEmail({
      to: email,
      subject: `Welcome back to AfricaSuk, ${name || "there"}`,
      htmlbody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <img
            src="https://africasuk.com/Newlogo.png"
            alt="AfricaSuk"
            style="width: 160px; margin-bottom: 30px;"
          />

          <h2>Welcome back to AfricaSuk${name ? `, ${name}` : ""}.</h2>

          <p>
            It's great to have you with us. We hope you find exactly
            what you're looking for today.
          </p>

          <p><strong>Shop with confidence.</strong></p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />

          <h3>Security notice</h3>

          <p>
            Someone just signed in to your AfricaSuk account using
            your Google account.
          </p>

          <p>
            If this was you, you don't need to do anything.
          </p>

          <p>
            If you don't recognize this activity, secure your account immediately.
          </p>

          <p>
            <a
              href="https://www.africasuk.com/auth/forgot-password"
              style="color: #004d26; font-weight: bold;"
            >
              Reset your password
            </a>
          </p>

          <p style="margin-top: 40px;">
            AfricaSuk<br />
            <a href="https://www.africasuk.com">
              www.africasuk.com
            </a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login email error:", error);

    return NextResponse.json(
      { error: "Failed to send login email" },
      { status: 500 }
    );
  }
}