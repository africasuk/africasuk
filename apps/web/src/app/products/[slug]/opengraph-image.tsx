import { ImageResponse } from "next/og";

import {
  ProductRepository,
} from "@africasuk/database";

import {
  ProductQueryService,
} from "@africasuk/api";

import {
  createServerSupabaseClient,
} from "@/lib/supabase/server";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const db =
    await createServerSupabaseClient();

  const service =
    new ProductQueryService(
      new ProductRepository(db)
    );

  const product =
    await service.getBySlug(slug);

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#ffffff",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Product Not Found
        </div>
      ),
      size
    );
  }

  const image =
    product.colors[0]?.images[0]?.imageUrl;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffffff",
        }}
      >
            <div
            style={{
                width: "45%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 40,
            }}
            >
            {image && (
                <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image}
                    width={420}
                    height={420}
                    alt={product.name}
                />
                </>
            )}
            </div>
        <div
          style={{
            width: "55%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 60,
          }}
        >
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {product.name}
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 30,
              color: "#6b7280",
            }}
          >
            {product.brand?.name}
          </div>

          <div
            style={{
              marginTop: 40,
              fontSize: 36,
              fontWeight: 700,
              color: "#004d26",
            }}
          >
            AfricaSuk
          </div>
        </div>
      </div>
    ),
    size
  );
}