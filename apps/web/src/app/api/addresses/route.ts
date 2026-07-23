import { NextResponse } from "next/server";

import {
  AddressRepository,
} from "@africasuk/database";

import {
  AddressService,
} from "@africasuk/api";

import { createClient } from "@/lib/auth/server";

async function createAddressService() {
  const supabase =
    await createClient();

  const repository =
    new AddressRepository(
      supabase
    );

  return new AddressService(
    repository
  );
}

export async function GET() {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const service =
      await createAddressService();

    const addresses =
      await service.getAll(
        user.id
      );

    return NextResponse.json(
      addresses
    );
  } catch (error) {
    console.error(
      "GET /api/addresses:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to fetch addresses.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const supabase =
      await createClient();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    let recipientName =
      user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      "";

    let phone =
      user.phone ??
      user.user_metadata?.phone ??
      "";

    try {
      const {
        data: profile,
        error,
      } = await supabase
        .from("profiles")
        .select(
          "full_name, phone"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.warn(
          "Profile lookup:",
          error
        );
      }

      if (profile) {
        recipientName =
          profile.full_name ??
          recipientName;

        phone =
          profile.phone ??
          phone;
      }
    } catch (error) {
      console.warn(
        "Unable to load profile:",
        error
      );
    }

    if (!recipientName) {
      recipientName =
        user.email ??
        "Customer";
    }

    console.log(
      "Creating address..."
    );

    console.log({
      userId: user.id,
      recipientName,
      phone,
      body,
    });

    const service =
      await createAddressService();

    const address =
      await service.create({
        ...body,
        userId: user.id,
        recipientName,
        phone,
        isDefault:
          body.isDefault ??
          false,
      });

    console.log(
      "Address created:",
      address
    );

    return NextResponse.json(
      address,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/addresses:",
      error
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create address.",
      },
      {
        status: 400,
      }
    );
  }
}