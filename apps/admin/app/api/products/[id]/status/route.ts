import { NextResponse } from "next/server";
import { ProductRepository } from "@africasuk/database";
import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

type ProductStatusBody = {
  status?: unknown;
};

const VALID_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;

type ProductStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    await requirePermission(Permissions.PRODUCTS_UPDATE);

    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        { message: "Product ID is required." },
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

    const body = rawBody as ProductStatusBody;
    const status = body.status;

    if (
      typeof status !== "string" ||
      !VALID_STATUSES.includes(status as ProductStatus)
    ) {
      return NextResponse.json(
        { message: "Invalid product status." },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const repository = new ProductRepository(supabase);

    await repository.updateStatus(id, status === "ACTIVE");

    const product = await repository.getById(id);

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to update product status:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update product status.",
      },
      { status: 500 }
    );
  }
}