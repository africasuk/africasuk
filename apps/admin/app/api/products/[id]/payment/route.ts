import { NextResponse } from "next/server";

import { ProductRepository } from "@africasuk/database";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PUT(
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
    const { id } = await params;

    const body = await request.json();

    const db =
      await createServerSupabaseClient();

    const repository =
      new ProductRepository(db);

    await repository.updatePaymentSettings(
      id,
      {
        allowCod: body.allowCod,
        allowOnlinePayment:
          body.allowOnlinePayment,
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to update payment settings.",
      },
      {
        status: 500,
      }
    );
  }
}