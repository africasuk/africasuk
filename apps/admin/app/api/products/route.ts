
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

export const runtime = "nodejs";

const R2_PUBLIC_URL = "https://r2-media.africasuk.com";

function createR2Client() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("Cloudflare R2 credentials are missing.");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

async function createProductService() {
  const db = createAdminSupabaseClient();

  return new ProductCommandService(
    new ProductRepository(db),
    new ProductColorRepository(db),
    new ProductImageRepository(db),
    new ProductVariantRepository(db),
  );
}

async function uploadToR2(file: File): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is missing.");
  }

  const r2 = createR2Client();
  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `africasuk/products/${crypto.randomUUID()}.${extension}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type || "application/octet-stream",
    }),
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const service = await createProductService();

    const colors = JSON.parse(
      String(formData.get("colors") ?? "[]"),
    );

    if (!Array.isArray(colors)) {
      throw new Error("Invalid product colors.");
    }

    for (const color of colors) {
      if (!Array.isArray(color.images)) {
        throw new Error("Invalid product image list.");
      }

      color.images = await Promise.all(
        color.images.map(async (imageKey: string) => {
          const file = formData.get(imageKey);

          if (!(file instanceof File) || file.size === 0) {
            throw new Error(`Image not found: ${imageKey}`);
          }

          return uploadToR2(file);
        }),
      );
    }

    const product = await service.create({
      categoryId: String(formData.get("categoryId") ?? ""),
      brandId: String(formData.get("brandId") ?? ""),
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      isActive: formData.get("isActive") === "on",
      colors,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product creation failed:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create product.",
      },
      { status: 400 },
    );
  }
}

export async function GET() {
  try {
    const db = createAdminSupabaseClient();

    const service = new ProductQueryService(
      new ProductRepository(db),
    );

    const products = await service.getAll();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to load products:", error);

    return NextResponse.json(
      { message: "Failed to load products." },
      { status: 500 },
    );
  }
}
