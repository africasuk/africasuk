import {
  NextRequest,
  NextResponse,
} from "next/server";

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

  return {
    supabase,
    service: new AddressService(
      new AddressRepository(
        supabase
      )
    ),
  };
}

export async function PATCH(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const {
      supabase,
      service,
    } =
      await createAddressService();

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const address =
      await service.getById(id);

    if (!address) {
      return NextResponse.json(
        {
          message:
            "Address not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      address.userId !== user.id
    ) {
      return NextResponse.json(
        {
          message:
            "Forbidden.",
        },
        {
          status: 403,
        }
      );
    }

    if (address.isDefault) {
      return NextResponse.json({
        success: true,
        message:
          "Address is already the default.",
      });
    }

    await service.setDefault(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Default address updated.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to set default address.",
      },
      {
        status: 500,
      }
    );
  }
}