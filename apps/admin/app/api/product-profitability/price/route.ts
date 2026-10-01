import { NextRequest, NextResponse } from "next/server";

import {
  ProductProfitabilityCommandService,
} from "@africasuk/api";

import {
  ProductProfitabilityRepository,
} from "@africasuk/database";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const variantId =
      typeof body.variantId === "string"
        ? body.variantId.trim()
        : "";

    const price = Number(body.price);

    if (!variantId) {
      return NextResponse.json(
        {
          success: false,
          error: "variantId is required.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Selling price must be a valid non-negative number.",
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

    await service.updateSellingPrice(
      variantId,
      price
    );

    return NextResponse.json({
      success: true,
      data: {
        variantId,
        price,
      },
    });
  } catch (error) {
    console.error(
      "Product profitability price PUT error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update selling price.",
      },
      { status: 500 }
    );
  }
}