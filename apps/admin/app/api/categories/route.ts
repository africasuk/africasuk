import { NextResponse } from "next/server";

import { CategoryRepository } from "@africasuk/database";
import { CategoryService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";

import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const repository = new CategoryRepository(supabase);
    const service = new CategoryService(repository);

    const categories = await service.getAll();

    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load categories.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("image") as File | null;

      let imageUrl: string | null = null;

      if (file && file.size > 0) {
        const buffer = Buffer.from(
          await file.arrayBuffer()
        );

        imageUrl = await new Promise<string>(
          (resolve, reject) => {
            const upload =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "africasuk/categories",
                },
                (error, result) => {
                  if (error || !result) {
                    return reject(error);
                  }

                  resolve(result.secure_url);
                }
              );

            Readable.from(buffer).pipe(upload);
          }
        );
      }

      const body = {
        name: String(formData.get("name") ?? ""),
        description: String(
          formData.get("description") ?? ""
        ),
        isActive:
          formData.get("isActive") === "on",

        level: 0,
        sortOrder: 0,

        imageUrl,
        parentId: null,
      };

    const supabase = await createServerSupabaseClient();

    const repository = new CategoryRepository(supabase);
    const service = new CategoryService(repository);

    const category = await service.create(body);

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create category.",
      },
      {
        status: 400,
      }
    );
  }
}