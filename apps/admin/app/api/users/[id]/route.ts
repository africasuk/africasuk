import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface UpdateUserBody {
  fullName?: unknown;
  phone?: unknown;
  role?: unknown;
  isActive?: unknown;
}

const VALID_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "STAFF",
  "CUSTOMER",
] as const;

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
        { message: "Only Super Admin can update users." },
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

    const body = rawBody as UpdateUserBody;

    const { fullName, phone, role, isActive } = body;

    if (
      typeof fullName !== "string" ||
      (phone !== null && typeof phone !== "string") ||
      typeof role !== "string" ||
      !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number]) ||
      typeof isActive !== "boolean"
    ) {
      return NextResponse.json(
        { message: "Invalid user details." },
        { status: 400 }
      );
    }

    if (role === "SUPER_ADMIN" && profile.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { message: "Only Super Admin can assign this role." },
        { status: 403 }
      );
    }

    const admin = createAdminSupabaseClient();

    const { data, error } = await admin
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone,
        role,
        is_active: isActive,
      })
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
    console.error("Failed to update user:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update user.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { profile } = await requirePermission(
      Permissions.USERS_DELETE
    );

    if (profile.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { message: "Only Super Admin can delete users." },
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

    const admin = createAdminSupabaseClient();

    const { data: target, error } = await admin
      .from("profiles")
      .select("user_id, role")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (target.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { message: "Super Admin cannot be deleted." },
        { status: 400 }
      );
    }

    const { error: authError } =
      await admin.auth.admin.deleteUser(target.user_id);

    if (authError) {
      throw authError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete user.",
      },
      { status: 500 }
    );
  }
}