import { NextResponse } from "next/server";

import { BrandRepository } from "@africasuk/database";
import { BrandService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

async function createBrandService() {
  const db = await createServerSupabaseClient();

  const repository = new BrandRepository(db);

  return new BrandService(repository);
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const service = await createBrandService();

    const brand = await service.getById(id);

    return NextResponse.json(brand);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Brand not found." },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const service = await createBrandService();

    const brand = await service.update(id, body);

    return NextResponse.json(brand);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update brand." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const service = await createBrandService();

    await service.delete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to delete brand." },
      { status: 400 }
    );
  }
}