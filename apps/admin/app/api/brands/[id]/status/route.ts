import { NextResponse } from "next/server";

import { BrandRepository } from "@africasuk/database";
import { BrandService } from "@africasuk/api";

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

    const repository = new BrandRepository(supabase);
    const service = new BrandService(repository);

    const brand = await service.update(id, {
      isActive,
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update brand status.",
      },
      {
        status: 400,
      }
    );
  }
}