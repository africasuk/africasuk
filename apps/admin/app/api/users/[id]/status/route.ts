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
            "Only Super Admin can change user status.",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;

    const { isActive } =
      await request.json();

    const admin =
      createAdminSupabaseClient();

    const { data, error } =
      await admin
        .from("profiles")
        .update({
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
            : "Failed to update status.",
      },
      {
        status: 400,
      }
    );
  }
}