import { NextResponse } from "next/server";

import { ProductRepository } from "@africasuk/database";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type PaymentSettingsBody = {
  allowCod?: unknown;
  allowOnlinePayment?: unknown;
};

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 },
      );
    }

    const rawBody: unknown = await request.json();

    if (
      typeof rawBody !== "object" ||
      rawBody === null ||
      Array.isArray(rawBody)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 },
      );
    }

    const body = rawBody as PaymentSettingsBody;

    if (
      typeof body.allowCod !== "boolean" ||
      typeof body.allowOnlinePayment !== "boolean"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "allowCod and allowOnlinePayment must be boolean values.",
        },
        { status: 400 },
      );
    }

    const db = await createServerSupabaseClient();
    const repository = new ProductRepository(db);

    await repository.updatePaymentSettings(id, {
      allowCod: body.allowCod,
      allowOnlinePayment: body.allowOnlinePayment,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update payment settings:", error);

    return NextResponse.json(
      { message: "Failed to update payment settings." },
      { status: 500 },
    );
  }
}