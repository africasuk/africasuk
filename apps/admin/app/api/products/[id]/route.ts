
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

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function uploadToR2(file: File): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is missing.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `africasuk/products/${crypto.randomUUID()}.${extension}`;

  await createR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type || "application/octet-stream",
    }),
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

async function createProductQueryService() {
  const db = createAdminSupabaseClient();
  return new ProductQueryService(new ProductRepository(db));
}

async function createProductCommandService() {
  const db = createAdminSupabaseClient();

  return new ProductCommandService(
    new ProductRepository(db),
    new ProductColorRepository(db),
    new ProductImageRepository(db),
    new ProductVariantRepository(db),
  );
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const service = await createProductQueryService();
    const product = await service.getById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to load product:", error);

    return NextResponse.json(
      { message: "Failed to load product." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const service = await createProductCommandService();

    await service.delete(id);

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete product:", error);

    return NextResponse.json(
      { message: "Failed to delete product." },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;
    const service = await createProductCommandService();
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const text = await request.text();

      if (!text) {
        return NextResponse.json(
          { message: "Empty body." },
          { status: 400 },
        );
      }

      const body = JSON.parse(text);

      await service.update(id, {
        categoryId: body.categoryId ?? "",
        brandId: body.brandId ?? "",
        name: body.name ?? "",
        description: body.description ?? null,
        isActive: body.isActive ?? true,
        allowCod: body.allowCod ?? true,
        allowOnlinePayment: body.allowOnlinePayment ?? true,
        colors: body.colors ?? [],
      });

      return NextResponse.json({
        message: "Product updated successfully.",
      });
    }

    const formData = await request.formData();
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

      const uploadedImages: string[] = [];

      for (const imageKey of color.images) {
        if (typeof imageKey !== "string") {
          throw new Error("Invalid product image reference.");
        }

        const file = formData.get(imageKey);

        if (file instanceof File) {
          if (file.size === 0) {
            throw new Error(`Image is empty: ${imageKey}`);
          }

          uploadedImages.push(await uploadToR2(file));
        } else {
          // Preserve existing image URLs.
          uploadedImages.push(imageKey);
        }
      }

      color.images = uploadedImages;
    }

    await service.update(id, {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      brandId: String(formData.get("brandId") ?? ""),
      isActive: formData.get("isActive") === "on",
      allowCod: formData.get("allowCod") !== "false",
      allowOnlinePayment:
        formData.get("allowOnlinePayment") !== "false",
      colors,
    });

    return NextResponse.json({
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error("Product update failed:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update product.",
      },
      { status: 500 },
    );
  }
}
