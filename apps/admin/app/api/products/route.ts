
import { NextResponse } from "next/server";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

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

import type { CreateProductColorDto } from "@africasuk/types";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

const R2_PUBLIC_URL = "https://r2-media.africasuk.com";
const MAX_IMAGES_PER_PRODUCT = 50;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const UPLOAD_BATCH_SIZE = 4;

type UploadedImage = {
  key: string;
  url: string;
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

async function uploadToR2(
  file: File,
  r2: S3Client,
  bucket: string,
): Promise<UploadedImage> {
  if (file.size === 0) {
    throw new Error(`The image "${file.name}" is empty.`);
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`The image "${file.name}" exceeds the 10 MB limit.`);
  }

  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };

  const extension = extensionByType[file.type];

  if (!extension) {
    throw new Error(
      `The image "${file.name}" must be JPEG, PNG, WebP, or AVIF.`,
    );
  }

  const key = `africasuk/products/${crypto.randomUUID()}.${extension}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    }),
  );

  return {
    key,
    url: `${R2_PUBLIC_URL}/${key}`,
  };
}

async function cleanupR2Images(
  r2: S3Client,
  bucket: string,
  images: UploadedImage[],
) {
  if (images.length === 0) return;

  try {
    await r2.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: images.map(({ key }) => ({ Key: key })),
          Quiet: true,
        },
      }),
    );
  } catch (error) {
    console.error("Failed to clean up R2 images:", error);
  }
}

async function uploadInBatches(
  files: { imageKey: string; file: File }[],
  r2: S3Client,
  bucket: string,
  uploadedImages: UploadedImage[],
): Promise<Map<string, string>> {
  const uploadedUrls = new Map<string, string>();

  for (let i = 0; i < files.length; i += UPLOAD_BATCH_SIZE) {
    const batch = files.slice(i, i + UPLOAD_BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(({ imageKey, file }) =>
        uploadToR2(file, r2, bucket).then((image) => ({
          imageKey,
          image,
        })),
      ),
    );

    const failures: string[] = [];

    for (const result of results) {
      if (result.status === "fulfilled") {
        uploadedImages.push(result.value.image);
        uploadedUrls.set(result.value.imageKey, result.value.image.url);
      } else {
        failures.push(
          result.reason instanceof Error
            ? result.reason.message
            : "An image upload failed.",
        );
      }
    }

    if (failures.length > 0) {
      throw new Error(failures.join(" "));
    }
  }

  return uploadedUrls;
}

function validateColors(value: unknown): value is CreateProductColorDto[] {
  if (!Array.isArray(value)) return false;

  return value.every((color) => {
    if (
      !color ||
      typeof color.name !== "string" ||
      typeof color.optionName !== "string" ||
      !Array.isArray(color.images) ||
      !Array.isArray(color.variants)
    ) {
      return false;
    }

    const validImages = color.images.every(
      (image: unknown) => typeof image === "string" && image.trim().length > 0,
    );

    const validVariants = color.variants.every(
      (variant: unknown) =>
        !!variant &&
        typeof variant === "object" &&
        typeof (variant as { optionValue?: unknown }).optionValue ===
          "string" &&
        typeof (variant as { price?: unknown }).price === "number" &&
        Number.isFinite((variant as { price: number }).price) &&
        typeof (variant as { stock?: unknown }).stock === "number" &&
        Number.isFinite((variant as { stock: number }).stock) &&
        (variant as { stock: number }).stock >= 0,
    );

    return validImages && validVariants;
  });
}

export async function POST(request: Request) {
  const uploadedImages: UploadedImage[] = [];
  let r2: S3Client | null = null;
  let bucket: string | null = null;

  try {
    const contentType = request.headers.get("content-type") ?? "";
    const isJson = contentType.includes("application/json");

    let name = "";
    let categoryId = "";
    let brandId = "";
    let description: string | null = null;
    let isActive = false;
    let colors: CreateProductColorDto[] = [];
    const filesToUpload: { imageKey: string; file: File }[] = [];

    if (isJson) {
      // New flow: images have already been uploaded individually to R2.
      const body: unknown = await request.json();

      if (!body || typeof body !== "object") {
        return NextResponse.json(
          { message: "Invalid product data." },
          { status: 400 },
        );
      }

      const data = body as Record<string, unknown>;

      name = typeof data.name === "string" ? data.name.trim() : "";
      categoryId =
        typeof data.categoryId === "string" ? data.categoryId.trim() : "";
      brandId =
        typeof data.brandId === "string" ? data.brandId.trim() : "";

      description =
        typeof data.description === "string" && data.description.trim()
          ? data.description.trim()
          : null;

      isActive = data.isActive === true;

      if (!validateColors(data.colors)) {
        return NextResponse.json(
          { message: "Invalid color, image, or variant data." },
          { status: 400 },
        );
      }

      colors = data.colors;
    } else {
      // Backward-compatible flow: product data and image files arrive together.
      const formData = await request.formData();

      name = String(formData.get("name") ?? "").trim();
      categoryId = String(formData.get("categoryId") ?? "").trim();
      brandId = String(formData.get("brandId") ?? "").trim();

      const descriptionValue = formData.get("description");
      description =
        typeof descriptionValue === "string" && descriptionValue.trim()
          ? descriptionValue.trim()
          : null;

      isActive = formData.get("isActive") === "on";

      try {
        colors = JSON.parse(
          String(formData.get("colors") ?? "[]"),
        ) as CreateProductColorDto[];
      } catch {
        return NextResponse.json(
          { message: "Invalid product colors JSON." },
          { status: 400 },
        );
      }

      if (!validateColors(colors)) {
        return NextResponse.json(
          { message: "Invalid color, image, or variant data." },
          { status: 400 },
        );
      }

      const imageKeys = new Set<string>();

      for (const color of colors) {
        for (const imageKey of color.images) {
          imageKeys.add(imageKey);
        }
      }

      if (imageKeys.size > MAX_IMAGES_PER_PRODUCT) {
        return NextResponse.json(
          {
            message: `A product can have up to ${MAX_IMAGES_PER_PRODUCT} images.`,
          },
          { status: 400 },
        );
      }

      for (const imageKey of imageKeys) {
        const file = formData.get(imageKey);

        if (!(file instanceof File) || file.size === 0) {
          return NextResponse.json(
            { message: `Image not found: ${imageKey}` },
            { status: 400 },
          );
        }

        filesToUpload.push({ imageKey, file });
      }

      if (filesToUpload.length > 0) {
        bucket = process.env.R2_BUCKET_NAME ?? null;

        if (!bucket) {
          throw new Error("R2_BUCKET_NAME is missing.");
        }

        r2 = createR2Client();

        const uploadedUrls = await uploadInBatches(
          filesToUpload,
          r2,
          bucket,
          uploadedImages,
        );

        colors = colors.map((color) => ({
          ...color,
          images: color.images.map((imageKey) => {
            const url = uploadedUrls.get(imageKey);

            if (!url) {
              throw new Error(`Uploaded image URL not found: ${imageKey}`);
            }

            return url;
          }),
        }));
      }
    }

    if (!name || !categoryId || !brandId) {
      return NextResponse.json(
        { message: "Product name, category, and brand are required." },
        { status: 400 },
      );
    }

    const totalImages = colors.reduce(
      (total, color) => total + color.images.length,
      0,
    );

    if (totalImages > MAX_IMAGES_PER_PRODUCT) {
      return NextResponse.json(
        {
          message: `A product can have up to ${MAX_IMAGES_PER_PRODUCT} images.`,
        },
        { status: 400 },
      );
    }

    const service = await createProductService();

    const product = await service.create({
      categoryId,
      brandId,
      name,
      description,
      isActive,
      colors,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product creation failed:", error);

    if (r2 && bucket && uploadedImages.length > 0) {
      await cleanupR2Images(r2, bucket, uploadedImages);
    }

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

    const service = new ProductQueryService(new ProductRepository(db));
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
