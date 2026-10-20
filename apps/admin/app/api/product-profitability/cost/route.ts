import { NextRequest, NextResponse } from "next/server";

import {
  ProductProfitabilityCommandService,
} from "@africasuk/api";

import {
  ProductProfitabilityRepository,
} from "@africasuk/database";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

type ProductCostBody = {
  colorId?: unknown;
  variantId?: unknown;
  wholesaleCost?: unknown;
  nairobiHandling?: unknown;
  transportShare?: unknown;
  borderOfficialCost?: unknown;
  jubaHandling?: unknown;
  packagingCost?: unknown;
  deliveryAllowance?: unknown;
  notes?: unknown;
  updatedBy?: unknown;
};

function parseOptionalCost(
  value: unknown,
  fieldName: string,
): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a valid non-negative number.`);
  }

  return parsed;
}

export async function PUT(request: NextRequest) {
  try {
    const rawBody: unknown = await request.json();

    if (
      typeof rawBody !== "object" ||
      rawBody === null ||
      Array.isArray(rawBody)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 },
      );
    }

    const body = rawBody as ProductCostBody;

    const {
      colorId,
      variantId,
      wholesaleCost,
      nairobiHandling,
      transportShare,
      borderOfficialCost,
      jubaHandling,
      packagingCost,
      deliveryAllowance,
      notes,
      updatedBy,
    } = body;

    const hasColor =
      typeof colorId === "string" && colorId.trim().length > 0;

    const hasVariant =
      typeof variantId === "string" && variantId.trim().length > 0;

    if (hasColor === hasVariant) {
      return NextResponse.json(
        {
          success: false,
          error: "Exactly one of colorId or variantId is required.",
        },
        { status: 400 },
      );
    }

    if (notes !== undefined && notes !== null && typeof notes !== "string") {
      return NextResponse.json(
        { success: false, error: "Notes must be a string." },
        { status: 400 },
      );
    }

    if (
      updatedBy !== undefined &&
      updatedBy !== null &&
      typeof updatedBy !== "string"
    ) {
      return NextResponse.json(
        { success: false, error: "updatedBy must be a string." },
        { status: 400 },
      );
    }

    const db = createAdminSupabaseClient();

    const repository = new ProductProfitabilityRepository(db);

    const service = new ProductProfitabilityCommandService(repository);

    const cost = await service.upsertCost({
      colorId: hasColor ? colorId as string : null,
      variantId: hasVariant ? variantId as string : null,

      wholesaleCost: parseOptionalCost(
        wholesaleCost,
        "Wholesale cost",
      ),

      nairobiHandling: parseOptionalCost(
        nairobiHandling,
        "Nairobi handling",
      ),

      transportShare: parseOptionalCost(
        transportShare,
        "Transport share",
      ),

      borderOfficialCost: parseOptionalCost(
        borderOfficialCost,
        "Border official cost",
      ),

      jubaHandling: parseOptionalCost(
        jubaHandling,
        "Juba handling",
      ),

      packagingCost: parseOptionalCost(
        packagingCost,
        "Packaging cost",
      ),

      deliveryAllowance: parseOptionalCost(
        deliveryAllowance,
        "Delivery allowance",
      ),

      notes: typeof notes === "string" ? notes : null,
      updatedBy: typeof updatedBy === "string" ? updatedBy : null,
    });

    return NextResponse.json({
      success: true,
      data: cost,
    });
  } catch (error) {
    console.error("Product profitability cost PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save product cost.",
      },
      { status: 500 },
    );
  }
}