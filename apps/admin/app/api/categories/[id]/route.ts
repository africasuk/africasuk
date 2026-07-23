import { NextResponse } from "next/server";

import { CategoryRepository } from "@africasuk/database";
import { CategoryService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const supabase = await createServerSupabaseClient();

    const repository = new CategoryRepository(supabase);
    const service = new CategoryService(repository);

    const category = await service.getById(id);

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Category not found.",
      },
      {
        status: 404,
      }
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

    const supabase = await createServerSupabaseClient();

    const repository = new CategoryRepository(supabase);
    const service = new CategoryService(repository);

    const category = await service.update(id, body);

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update category.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const supabase = await createServerSupabaseClient();

    const repository = new CategoryRepository(supabase);
    const service = new CategoryService(repository);

    await service.delete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete category.",
      },
      {
        status: 400,
      }
    );
  }
}