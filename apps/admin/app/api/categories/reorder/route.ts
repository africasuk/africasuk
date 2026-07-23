import { NextResponse } from "next/server";

import { CategoryRepository } from "@africasuk/database";
import { CategoryService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  try {
    const items = await request.json();

    const supabase =
      await createServerSupabaseClient();

    const repository =
      new CategoryRepository(supabase);

    const service =
      new CategoryService(repository);

    await service.reorder(items);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to reorder categories.",
      },
      {
        status: 500,
      }
    );
  }
}