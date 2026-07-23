import { NextResponse } from "next/server";

import { ProductRepository } from "@africasuk/database";

import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
    await requirePermission(
      Permissions.PRODUCTS_UPDATE
    );

    const { id } = await params;

    const { status } =
      await request.json();

    const supabase =
      await createServerSupabaseClient();

    const repository =
      new ProductRepository(supabase);

    if (
      ![
        "DRAFT",
        "ACTIVE",
        "ARCHIVED",
      ].includes(status)
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid product status.",
        },
        {
          status: 400,
        }
      );
    }

    await repository.updateStatus(
      id,
      status
    );

    const product =
      await repository.getById(id);

    return NextResponse.json(
      product
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update product status.",
      },
      {
        status: 400,
      }
    );
  }
}