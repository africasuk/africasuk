import { NextResponse } from "next/server";

import {
  ProductProfitabilityQueryService,
} from "@africasuk/api";

import {
  ProductProfitabilityRepository,
} from "@africasuk/database";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const db = createAdminSupabaseClient();

    const service =
      new ProductProfitabilityQueryService(
        new ProductProfitabilityRepository(db)
      );

    const variants = await service.getAll();

    return NextResponse.json({
      success: true,
      data: variants,
    });
  } catch (error) {
    console.error(
      "Product profitability GET error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load product profitability.",
      },
      { status: 500 }
    );
  }
}