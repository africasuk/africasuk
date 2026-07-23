import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("images") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        {
          message: "No images uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    if (files.length > 6) {
      return NextResponse.json(
        {
          message:
            "Maximum 6 images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    const uploads = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();

        const buffer = Buffer.from(bytes);

        return new Promise<string>(
          (resolve, reject) => {
            const stream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "africasuk/products",
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

            stream.end(buffer);
          }
        );
      })
    );

    return NextResponse.json(uploads);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Image upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}