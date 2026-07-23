import { NextResponse } from "next/server";
import { Readable } from "stream";

import { ZodError } from "zod";

import { BrandRepository } from "@africasuk/database";
import { BrandService } from "@africasuk/api";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";

async function createBrandService() {
  const db = await createServerSupabaseClient();

  return new BrandService(
    new BrandRepository(db)
  );
}

export async function GET() {
  try {
    const service =
      await createBrandService();

    const brands =
      await service.getAll();

    return NextResponse.json(brands);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Failed to fetch brands.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file = formData.get(
      "logo"
    ) as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        {
          message:
            "Brand logo is required.",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const logoUrl =
      await new Promise<string>(
        (resolve, reject) => {
          const upload =
            cloudinary.uploader.upload_stream(
              {
                folder:
                  "africasuk/brands",
              },
              (error, result) => {
                if (
                  error ||
                  !result
                ) {
                  reject(error);
                  return;
                }

                resolve(
                  result.secure_url
                );
              }
            );

          Readable.from(buffer).pipe(
            upload
          );
        }
      );

    const website = String(
      formData.get("website") ?? ""
    ).trim();

    const body = {
      name: String(
        formData.get("name") ?? ""
      ).trim(),

      description:
        String(
          formData.get(
            "description"
          ) ?? ""
        ).trim() || null,

      website:
        website.length > 0
          ? website
          : null,

      logoUrl,

      slug: "",

      isActive:
        formData.get(
          "isActive"
        ) === "on",
    };

    const service =
      await createBrandService();

    const brand =
      await service.create(body);

    return NextResponse.json(
      brand,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message:
            error.issues
              .map(
                (issue) =>
                  issue.message
              )
              .join("\n"),
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create brand.",
      },
      {
        status: 400,
      }
    );
  }
}