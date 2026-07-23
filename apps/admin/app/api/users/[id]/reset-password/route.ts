import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const DEFAULT_PASSWORD = "Pass@123";

export async function PATCH(
  _request: Request,
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
            "Only Super Admin can reset passwords.",
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
      data: profileData,
      error,
    } = await admin
      .from("profiles")
      .select("user_id")
      .eq("id", id)
      .single();

    if (error) throw error;

    const authError =
      await admin.auth.admin.updateUserById(
        profileData.user_id,
        {
          password:
            DEFAULT_PASSWORD,
        }
      );

    if (authError.error) {
      throw authError.error;
    }

    await admin
      .from("profiles")
      .update({
        must_change_password: true,
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
  

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to reset password.",
      },
      {
        status: 400,
      }
    );
  }
}