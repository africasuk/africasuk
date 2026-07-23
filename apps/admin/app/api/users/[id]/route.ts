import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { profile } =
      await requirePermission(
        Permissions.USERS_UPDATE
      );

    if (profile.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          message:
            "Only Super Admin can update users.",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;

    const {
      fullName,
      phone,
      role,
      isActive,
    } = await request.json();

    const admin =
      createAdminSupabaseClient();

    const { data, error } =
      await admin
        .from("profiles")
        .update({
          full_name: fullName,
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
  

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update user.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { profile } =
      await requirePermission(
        Permissions.USERS_DELETE
      );

    if (profile.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          message:
            "Only Super Admin can delete users.",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;

    const admin =
      createAdminSupabaseClient();

    const {
      data: target,
      error,
    } = await admin
      .from("profiles")
      .select("user_id, role")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (
      target.role ===
      "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          message:
            "Super Admin cannot be deleted.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      error: authError,
    } =
      await admin.auth.admin.deleteUser(
        target.user_id
      );

    if (authError) {
      throw authError;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete user.",
      },
      {
        status: 400,
      }
    );
  }
}