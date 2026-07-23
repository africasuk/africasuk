import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const ids =
    searchParams
      .get("ids")
      ?.split(",")
      .filter(Boolean) ?? [];

  if (!ids.length) {
    return NextResponse.json([]);
  }

  const db =
    await createServerSupabaseClient();

  const { data, error } = await db
    .from("products")
    .select(
      "id,allow_cod,allow_online_payment"
    )
    .in("id", ids);

  if (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    data.map((product) => ({
      id: product.id,
      allowCod: product.allow_cod,
      allowOnlinePayment:
        product.allow_online_payment,
    }))
  );
}