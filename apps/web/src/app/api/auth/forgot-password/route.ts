import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/zeptomail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
    });

    if (error) {
      console.error("Generate reset link error:", error);

      // Do not reveal whether the email exists.
      return NextResponse.json({ success: true });
    }

    const tokenHash = data.properties.hashed_token;

    const resetLink =
      `https://www.africasuk.com/auth/reset-password` +
      `?token_hash=${encodeURIComponent(tokenHash)}` +
      `&type=recovery`;

    await sendEmail({
      to: email,
      subject: "Reset your AfricaSuk password",
      htmlbody: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            color: #111111;
          "
        >
          <img
            src="https://www.africasuk.com/Newlogo.png"
            alt="AfricaSuk"
            style="width: 160px; margin-bottom: 30px;"
          />

          <h2>Reset your password</h2>

          <p>
            We received a request to reset the password for your
            AfricaSuk account.
          </p>

          <p>
            If you made this request, click the button below to
            create a new password.
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${resetLink}"
              style="
                display: inline-block;
                background: #004d26;
                color: #ffffff;
                text-decoration: none;
                padding: 14px 24px;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </div>

          <div
            style="
              background: #f5f5f5;
              border-radius: 8px;
              padding: 16px;
              margin-top: 25px;
            "
          >
            <p
              style="
                margin: 0;
                font-size: 14px;
                line-height: 1.6;
              "
            >
              <strong>Didn't request this?</strong>
              <br />
              If you did not request this password reset, please
              reset your password immediately or contact
              <a
                href="mailto:support@africasuk.com"
                style="
                  color: #004d26;
                  font-weight: bold;
                "
              >
                support@africasuk.com
              </a>.
            </p>
          </div>

          <p
            style="
              margin-top: 30px;
              font-size: 13px;
              line-height: 1.6;
              color: #666666;
            "
          >
            If you did not request this email, you can safely
            ignore it.
          </p>

          <p style="margin-top: 40px;">
            AfricaSuk<br />

            <a
              href="https://www.africasuk.com"
              style="color: #004d26;"
            >
              www.africasuk.com
            </a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { error: "Failed to process password reset" },
      { status: 500 },
    );
  }
}