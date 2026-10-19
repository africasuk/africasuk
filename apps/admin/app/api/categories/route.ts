
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { CategoryRepository } from "@africasuk/database";
import { CategoryService } from "@africasuk/api";
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
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function uploadToR2(file: File): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is missing.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `africasuk/categories/${crypto.randomUUID()}.${extension}`;

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

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();
    const service = new CategoryService(new CategoryRepository(supabase));
    const categories = await service.getAll();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to load categories:", error);

    return NextResponse.json(
      { message: "Failed to load categories." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    let imageUrl: string | null = null;

    if (file instanceof File && file.size > 0) {
      imageUrl = await uploadToR2(file);
    }

    const body = {
      name: String(formData.get("name") ?? ""),
      description: String(formData.get("description") ?? ""),
      isActive: formData.get("isActive") === "on",
      level: 0,
      sortOrder: 0,
      imageUrl,
      parentId: null,
    };

    const supabase = createAdminSupabaseClient();
    const service = new CategoryService(new CategoryRepository(supabase));
    const category = await service.create(body);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create category.",
      },
      { status: 400 },
    );
  }
}
