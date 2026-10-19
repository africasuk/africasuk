import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      message:
        "Cloudinary uploads are disabled. Upload images through the R2 upload endpoint instead.",
    },
    { status: 410 },
  );
}