import { NextResponse } from "next/server";

import { CategoryRepository } from "@africasuk/database";
import { CategoryService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const { isActive } = await request.json();

    const supabase = await createServerSupabaseClient();

    const repository = new CategoryRepository(supabase);
    const service = new CategoryService(repository);

    const category = await service.update(id, {
      isActive,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update category status.",
      },
      {
        status: 400,
      }
    );
  }
}