import { NextResponse } from "next/server";

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

import { createServerSupabaseClient } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";



async function createProductQueryService() {
  const db = await createServerSupabaseClient();

  return new ProductQueryService(
    new ProductRepository(db)
  );
}


async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  return new Promise((resolve, reject) => {
    const upload =
      cloudinary.uploader.upload_stream(
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
async function createProductCommandService() {
  const db = await createServerSupabaseClient();

  return new ProductCommandService(
    new ProductRepository(db),
    new ProductColorRepository(db),
    new ProductImageRepository(db),
    new ProductVariantRepository(db)
  );
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const service = await createProductQueryService();

    const product = await service.getById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to load product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const service = await createProductCommandService();

    await service.delete(id);

    return NextResponse.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete product.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const service =
      await createProductCommandService();

    const contentType =
      request.headers.get("content-type");

    // Switch update (JSON)
if (
  contentType?.includes("application/json")
) {
  const text = await request.text();

  if (!text) {
    return NextResponse.json(
      {
        message: "Empty body",
      },
      {
        status: 400,
      }
    );
  }

  const body = JSON.parse(text);


  await service.update(id, {
    categoryId: body.categoryId ?? "",
    brandId: body.brandId ?? "",
    name: body.name ?? "",
    description: body.description ?? null,
    isActive: body.isActive ?? true,

    allowCod:
      body.allowCod ?? true,

    allowOnlinePayment:
      body.allowOnlinePayment ?? true,

    colors:
      body.colors ?? [],
  });


  return NextResponse.json({
    message:
      "Product updated successfully.",
  });
}

    // Full product update (FormData)
    const formData =
      await request.formData();

const colors = JSON.parse(
  formData.get("colors") as string
);

for (const color of colors) {
  const uploadedImages: string[] = [];

  for (const imageKey of color.images) {
    const file = formData.get(imageKey);

    if (file instanceof File) {
      const imageUrl = await uploadToCloudinary(
        file,
        "africasuk/products"
      );

      uploadedImages.push(imageUrl);
    } else {
      uploadedImages.push(imageKey);
    }
  }

  color.images = uploadedImages;
}

    const dto = {
      name:
        formData.get("name") as string,

      description:
        formData.get("description") as string,

      categoryId:
        formData.get("categoryId") as string,

      brandId:
        formData.get("brandId") as string,

      isActive:
        formData.get("isActive") === "on",

      allowCod:
        formData.get("allowCod") !== "false",

      allowOnlinePayment:
        formData.get("allowOnlinePayment") !== "false",

      colors,
    };

    await service.update(id, dto);

    return NextResponse.json({
      message:
        "Product updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update product.",
      },
      {
        status: 500,
      }
    );
  }
}