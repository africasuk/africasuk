import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

type UpdateUserStatusBody = {
  isActive?: unknown;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { profile } = await requirePermission(
      Permissions.USERS_UPDATE
    );

    if (profile.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          message: "Only Super Admin can change user status.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 }
      );
    }

    const rawBody: unknown = await request.json();

    if (
      typeof rawBody !== "object" ||
      rawBody === null ||
      Array.isArray(rawBody)
    ) {
      return NextResponse.json(
        { message: "Invalid request body." },
        { status: 400 }
      );
    }

    const body = rawBody as UpdateUserStatusBody;

    if (typeof body.isActive !== "boolean") {
      return NextResponse.json(
        { message: "isActive must be a boolean." },
        { status: 400 }
      );
    }

    const admin = createAdminSupabaseClient();

    const { data, error } = await admin
      .from("profiles")
      .update({ is_active: body.isActive })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      user: data,
    });
  } catch (error) {
    console.error("Failed to update user status:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update status.",
      },
      { status: 500 }
    );
  }
}