import { NextRequest, NextResponse } from "next/server";

import {
  ProductProfitabilityCommandService,
} from "@africasuk/api";

import {
  ProductProfitabilityRepository,
} from "@africasuk/database";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function PUT(
  request: NextRequest
) {
  try {
    const body = await request.json();

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

    const hasColor = Boolean(colorId);
    const hasVariant = Boolean(variantId);

    if (hasColor === hasVariant) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Exactly one of colorId or variantId is required.",
        },
        { status: 400 }
      );
    }

    const db = createAdminSupabaseClient();

    const repository =
      new ProductProfitabilityRepository(db);

    const service =
      new ProductProfitabilityCommandService(
        repository
      );

    const cost = await service.upsertCost({
      colorId: colorId ?? null,
      variantId: variantId ?? null,

      wholesaleCost:
        wholesaleCost === null ||
        wholesaleCost === undefined ||
        wholesaleCost === ""
          ? null
          : Number(wholesaleCost),

      nairobiHandling:
        nairobiHandling === null ||
        nairobiHandling === undefined ||
        nairobiHandling === ""
          ? null
          : Number(nairobiHandling),

      transportShare:
        transportShare === null ||
        transportShare === undefined ||
        transportShare === ""
          ? null
          : Number(transportShare),

      borderOfficialCost:
        borderOfficialCost === null ||
        borderOfficialCost === undefined ||
        borderOfficialCost === ""
          ? null
          : Number(borderOfficialCost),

      jubaHandling:
        jubaHandling === null ||
        jubaHandling === undefined ||
        jubaHandling === ""
          ? null
          : Number(jubaHandling),

      packagingCost:
        packagingCost === null ||
        packagingCost === undefined ||
        packagingCost === ""
          ? null
          : Number(packagingCost),

      deliveryAllowance:
        deliveryAllowance === null ||
        deliveryAllowance === undefined ||
        deliveryAllowance === ""
          ? null
          : Number(deliveryAllowance),

      notes: notes ?? null,
      updatedBy: updatedBy ?? null,
    });

    return NextResponse.json({
      success: true,
      data: cost,
    });
  } catch (error) {
    console.error(
      "Product profitability cost PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save product cost.",
      },
      { status: 500 }
    );
  }
}