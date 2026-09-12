import { NextResponse } from "next/server";
import { Readable } from "stream";

import {
  ProductRepository,
  ProductColorRepository,
  ProductImageRepository,
  ProductVariantRepository,
} from "@africasuk/database";

import {
  ProductCommandService,
  ProductQueryService,
} from "@africasuk/api";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import cloudinary from "@/lib/cloudinary";

async function createProductService() {
  const db = createAdminSupabaseClient();

  return new ProductCommandService(
    new ProductRepository(db),
    new ProductColorRepository(db),
    new ProductImageRepository(db),
    new ProductVariantRepository(db)
  );
}

async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error || !result) {
          reject(error);
          return;
        }

        resolve(result.secure_url);
      }
    );

    Readable.from(buffer).pipe(upload);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const service = await createProductService();

    const colors = JSON.parse(
      String(formData.get("colors"))
    );

    for (const color of colors) {
      const uploadPromises = color.images.map(
        async (imageKey: string) => {
          const file = formData.get(imageKey) as File;

          if (!file || !(file instanceof File)) {
            throw new Error(`Image not found: ${imageKey}`);
          }

          return uploadToCloudinary(
            file,
            "africasuk/products"
          );
        }
      );

      const uploadedImages = await Promise.all(
        uploadPromises
      );

      color.images = uploadedImages;
    }

    const product = await service.create({
      categoryId: String(
        formData.get("categoryId")
      ),

      brandId: String(
        formData.get("brandId")
      ),

      name: String(
        formData.get("name")
      ),

      description: String(
        formData.get("description") ?? ""
      ),

      isActive:
        formData.get("isActive") === "on",

      colors,
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create product.",
      },
      {
        status: 400,
      }
    );
  }
}

export async function GET() {
  try {
    const db = createAdminSupabaseClient();

    const service = new ProductQueryService(
      new ProductRepository(db)
    );

    const products = await service.getAll();

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load products.",
      },
      {
        status: 500,
      }
    );
  }
}