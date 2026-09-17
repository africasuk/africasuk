import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\d{4}$/.test(code)) {
      return NextResponse.json(
        { error: "Enter a valid 4-digit code." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("email_verification_codes")
      .select("*")
      .eq("email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("OTP lookup error:", error);

      return NextResponse.json(
        { error: "Could not verify the code." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date(data.expires_at).getTime() < Date.now()) {
      await supabase
        .from("email_verification_codes")
        .delete()
        .eq("id", data.id);

      return NextResponse.json(
        { error: "This code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (data.attempts >= 5) {
      return NextResponse.json(
        { error: "Too many attempts. Please request a new code." },
        { status: 429 }
      );
    }

    if (data.code !== code) {
      await supabase
        .from("email_verification_codes")
        .update({
          attempts: data.attempts + 1,
        })
        .eq("id", data.id);

      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    await supabase
      .from("email_verification_codes")
      .delete()
      .eq("id", data.id);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return NextResponse.json(
      { error: "Verification failed." },
      { status: 500 }
    );
  }
}