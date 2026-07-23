import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/auth/guards";
import { Permissions } from "@/lib/auth/permissions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    await requirePermission(
      Permissions.DASHBOARD_VIEW
    );

    const admin =
      createAdminSupabaseClient();

    const [
      products,
      orders,
      inventory,
    ] = await Promise.all([
      admin
        .from("products")
        .select("id", {
          count: "exact",
          head: true,
        }),

      admin
        .from("orders")
        .select("id", {
          count: "exact",
          head: true,
        }),

      admin
        .from("inventory")
        .select("id", {
          count: "exact",
          head: true,
        }),
    ]);

    return NextResponse.json({
      products:
        products.count ?? 0,
      orders:
        orders.count ?? 0,
      inventory:
        inventory.count ?? 0,

      salesToday: 0,
      lowStock: 0,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load dashboard.",
      },
      {
        status: 400,
      }
    );
  }
}