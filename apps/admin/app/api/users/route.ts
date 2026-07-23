import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const DEFAULT_PASSWORD = "Pass@123";

export async function POST(request: Request) {
  try {
    await requirePermission(
      Permissions.USERS_CREATE
    );

    const body = await request.json();

    const {
      fullName,
      email,
      role,
    } = body;

    if (!fullName || !email || !role) {
      return NextResponse.json(
        {
          message:
            "Full name, email and role are required.",
        },
        {
          status: 400,
        }
      );
    }

    const admin = createAdminSupabaseClient();

    // Check if profile already exists
    const {
      data: existingProfile,
      error: profileError,
    } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (existingProfile) {
      return NextResponse.json(
        {
          message:
            "A user with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // Check if auth user already exists
    const {
      data: authUsers,
      error: listError,
    } = await admin.auth.admin.listUsers();

    if (listError) {
      throw listError;
    }

    const existingAuthUser =
      authUsers.users.find(
        (user) =>
          user.email?.toLowerCase() ===
          email.toLowerCase()
      );

    if (existingAuthUser) {
      return NextResponse.json(
        {
          message:
            "Authentication user already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // Create auth user (trigger creates profile)
    const {
      data: authData,
      error: authError,
    } = await admin.auth.admin.createUser({
      email,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role,
      },
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error(
        "Failed to create authentication user."
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: authData.user,
        temporaryPassword:
          DEFAULT_PASSWORD,
      },
      {
        status: 201,
      }
    );
  } catch (error: unknown) {
  

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create user.",
      },
      {
        status: 400,
      }
    );
  }
}