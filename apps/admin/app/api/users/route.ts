import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

const DEFAULT_PASSWORD = "Pass@123";

type CreateUserBody = {
  fullName?: unknown;
  email?: unknown;
  role?: unknown;
};

const VALID_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "STAFF",
  "CUSTOMER",
] as const;

export async function POST(request: Request) {
  try {
    await requirePermission(Permissions.USERS_CREATE);

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

    const body = rawBody as CreateUserBody;
    const { fullName, email, role } = body;

    if (
      typeof fullName !== "string" ||
      !fullName.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof role !== "string" ||
      !VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])
    ) {
      return NextResponse.json(
        { message: "Full name, valid email and role are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = fullName.trim();

    const admin = createAdminSupabaseClient();

    // Check if the profile already exists.
    const {
      data: existingProfile,
      error: profileError,
    } = await admin
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (existingProfile) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 409 }
      );
    }

    // Check whether the authentication user already exists.
    const {
      data: authUsers,
      error: listError,
    } = await admin.auth.admin.listUsers();

    if (listError) {
      throw listError;
    }

    const existingAuthUser = authUsers.users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail
    );

    if (existingAuthUser) {
      return NextResponse.json(
        { message: "Authentication user already exists." },
        { status: 409 }
      );
    }

    // Create the authentication user. The database trigger
    // is expected to create the associated profile.
    const {
      data: authData,
      error: authError,
    } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: normalizedName,
        role,
      },
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      throw new Error("Failed to create authentication user.");
    }

    return NextResponse.json(
      {
        success: true,
        user: authData.user,
        temporaryPassword: DEFAULT_PASSWORD,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Admin Create User Error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create user.",
      },
      { status: 500 }
    );
  }
}