
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ZodError } from "zod";

import { BrandRepository } from "@africasuk/database";
import { BrandService } from "@africasuk/api";
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

async function uploadToR2(file: File): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is missing.");
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const key = `africasuk/brands/${crypto.randomUUID()}.${extension}`;
  const r2 = createR2Client();

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

async function createBrandService() {
  const db = createAdminSupabaseClient();

  return new BrandService(new BrandRepository(db));
}

export async function GET() {
  try {
    const service = await createBrandService();
    const brands = await service.getAll();

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Failed to fetch brands:", error);

    return NextResponse.json(
      { message: "Failed to fetch brands." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("logo");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { message: "Brand logo is required." },
        { status: 400 },
      );
    }

    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { message: "Brand name is required." },
        { status: 400 },
      );
    }

    const logoUrl = await uploadToR2(file);
    const website = String(formData.get("website") ?? "").trim();

    const body = {
      name,
      description:
        String(formData.get("description") ?? "").trim() || null,
      website: website || null,
      logoUrl,
      slug: "",
      isActive: formData.get("isActive") === "on",
    };

    const service = await createBrandService();
    const brand = await service.create(body);

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error("Failed to create brand:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.issues.map((issue) => issue.message).join("\n"),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create brand.",
      },
      { status: 400 },
    );
  }
}
