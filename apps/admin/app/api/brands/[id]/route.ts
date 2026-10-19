
import { NextResponse } from "next/server";

import { BrandRepository } from "@africasuk/database";
import { BrandService } from "@africasuk/api";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type BrandUpdateInput = {
  name?: string;
  slug?: string;
  description?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  isActive?: boolean;
};

async function createBrandService() {
  const db = createAdminSupabaseClient();
  const repository = new BrandRepository(db);

  return new BrandService(repository);
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const service = await createBrandService();
    const brand = await service.getById(id);

    if (!brand) {
      return NextResponse.json(
        { message: "Brand not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Failed to fetch brand:", error);

    return NextResponse.json(
      { message: "Failed to fetch brand." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as BrandUpdateInput;

    const service = await createBrandService();
    const brand = await service.update(id, body);

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Failed to update brand:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update brand.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const service = await createBrandService();

    await service.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete brand:", error);

    return NextResponse.json(
      { message: "Failed to delete brand." },
      { status: 400 },
    );
  }
}
