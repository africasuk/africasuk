
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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

  const r2 = createR2Client();
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
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
    const files = formData.getAll("images").filter(
      (item): item is File => item instanceof File && item.size > 0,
    );

    if (files.length === 0) {
      return NextResponse.json(
        { message: "No images uploaded." },
        { status: 400 },
      );
    }

    if (files.length > 6) {
      return NextResponse.json(
        { message: "Maximum 6 images are allowed." },
        { status: 400 },
      );
    }

    const uploads = await Promise.all(files.map(uploadToR2));

    return NextResponse.json(uploads);
  } catch (error) {
    console.error("R2 image upload failed:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Image upload failed.",
      },
      { status: 500 },
    );
  }
}
