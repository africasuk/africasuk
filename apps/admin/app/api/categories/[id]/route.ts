
import { NextResponse } from "next/server";

import { CategoryRepository } from "@africasuk/database";
import { CategoryService } from "@africasuk/api";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

type CategoryUpdateInput = {
  name?: string;
  level?: number;
  isActive?: boolean;
  sortOrder?: number;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
};

async function createCategoryService() {
  const supabase = createAdminSupabaseClient();
  const repository = new CategoryRepository(supabase);

  return new CategoryService(repository);
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const service = await createCategoryService();
    const category = await service.getById(id);

    if (!category) {
      return NextResponse.json(
        { message: "Category not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to load category:", error);

    return NextResponse.json(
      { message: "Failed to load category." },
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
    const body = (await request.json()) as CategoryUpdateInput;

    const service = await createCategoryService();
    const category = await service.update(id, body);

    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to update category:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update category.",
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
    const service = await createCategoryService();

    await service.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete category:", error);

    return NextResponse.json(
      { message: "Failed to delete category." },
      { status: 500 },
    );
  }
}
