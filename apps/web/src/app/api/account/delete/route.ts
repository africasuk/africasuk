import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  try {
    const { reason } = await request.json();

    if (!reason?.trim()) {
      return NextResponse.json(
        { error: "Deletion reason is required." },
        { status: 400 },
      );
    }

    if (reason.trim().length > 500) {
      return NextResponse.json(
        { error: "Deletion reason must be 500 characters or less." },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const forwardedFor = request.headers.get("x-forwarded-for");

    const ipAddress =
      forwardedFor?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;

    const userAgent = request.headers.get("user-agent");

    // Save deletion audit record BEFORE deleting the user.
    const { error: auditError } = await admin
      .from("deleted_accounts")
      .insert({
        user_id: user.id,
        email: user.email ?? null,
        deletion_reason: reason.trim(),
        deleted_by: "user",
        ip_address: ipAddress,
        user_agent: userAgent,
      });

    if (auditError) {
      console.error(
        "Account deletion audit error:",
        auditError,
      );

      return NextResponse.json(
        {
          error:
            "Account deletion could not be completed. Please try again.",
        },
        { status: 500 },
      );
    }

    // Permanently delete the Supabase Auth user.
    const { error: deleteError } =
      await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error(
        "Supabase account deletion error:",
        deleteError,
      );

      return NextResponse.json(
        {
          error:
            "Account deletion could not be completed. Please contact support.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Account deletion error:", error);

    return NextResponse.json(
      {
        error: "Account deletion failed. Please try again.",
      },
      { status: 500 },
    );
  }
}