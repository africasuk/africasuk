import { NextResponse } from "next/server";

import {
  PaymentRepository,
} from "@africasuk/database";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      referenceId: string;
    }>;
  },
) {
  try {
    const { referenceId } =
      await params;

    const supabase =
      await createServerSupabaseClient();

    const payment =
      await new PaymentRepository(
        supabase,
      ).findByReferenceId(
        referenceId,
      );

    if (!payment) {
      return NextResponse.json(
        {
          message:
            "Payment not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      payment,
    );
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      {
        status: 500,
      },
    );
  }
}