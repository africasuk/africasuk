import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/server";
import { sendEmail } from "@/lib/zeptomail";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const supabase = await createClient();

    // Remove previous codes for this email
    await supabase
      .from("email_verification_codes")
      .delete()
      .eq("email", normalizedEmail);

    // Generate 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error: insertError } = await supabase
      .from("email_verification_codes")
      .insert({
        email: normalizedEmail,
        code,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("OTP database error:", insertError);

      return NextResponse.json(
        { error: "Could not create verification code." },
        { status: 500 }
      );
    }

    await sendEmail({
      to: normalizedEmail,
      subject: `${code} is your AfricaSuk verification code`,
      htmlbody: `
        <div style="font-family:Arial,sans-serif;background:#f5f7f6;padding:40px 20px;">
          <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:16px;padding:40px;">

            <div style="text-align:center;margin-bottom:30px;">
              <img
                src="https://africasuk.com/logo.svg"
                alt="AfricaSuk"
                style="width:160px;"
              />
            </div>

            <h2 style="color:#111111;text-align:center;">
              Verify your email
            </h2>

            <p style="color:#555555;line-height:1.7;text-align:center;">
              Use the verification code below to confirm your AfricaSuk email address.
            </p>

            <div style="
              margin:30px auto;
              padding:20px;
              background:#f5f7f6;
              border-radius:12px;
              text-align:center;
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              color:#004d26;
            ">
              ${code}
            </div>

            <p style="color:#777777;text-align:center;font-size:13px;">
              This code expires in 10 minutes.
            </p>

            <p style="color:#777777;text-align:center;font-size:13px;margin-top:30px;">
              If you didn't request this code, you can safely ignore this email.
            </p>

            <p style="color:#555555;margin-top:35px;">
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
    console.error("Signup OTP error:", error);

    return NextResponse.json(
      { error: "Failed to send verification code." },
      { status: 500 }
    );
  }
}