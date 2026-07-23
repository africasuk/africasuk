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
  request: Request,
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

    const existing =
      await service.getById(id);

    if (!existing) {
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
      existing.userId !== user.id
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

    const body =
      await request.json();

    const address =
      await service.update(
        id,
        body
      );

    return NextResponse.json(
      address
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update address.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
  request: Request,
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

    const existing =
      await service.getById(id);

    if (!existing) {
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
      existing.userId !== user.id
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

    await service.delete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete address.",
      },
      {
        status: 400,
      }
    );
  }
}