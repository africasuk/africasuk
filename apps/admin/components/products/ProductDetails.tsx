"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductVariantTable } from "./ProductVariantTable";
import { Switch } from "@/components/ui/switch";

interface Props {
  product: ProductWithDetails;
}

export function ProductDetails({
  product,
}: Props) {
const [allowCod, setAllowCod] = useState(
  product.allowCod
);

const [allowOnlinePayment, setAllowOnlinePayment] =
  useState(
    product.allowOnlinePayment
  );

const updatePayment = async (
  field: "allowCod" | "allowOnlinePayment",
  value: boolean
) => {
  const newAllowCod =
    field === "allowCod"
      ? value
      : allowCod;

  const newAllowOnlinePayment =
    field === "allowOnlinePayment"
      ? value
      : allowOnlinePayment;

  await fetch(
    `/api/products/${product.id}/payment`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        allowCod: newAllowCod,
        allowOnlinePayment:
          newAllowOnlinePayment,
      }),
    }
  );
};

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <div className="rounded-lg border p-6 space-y-2">
        <h1 className="text-2xl font-bold">
          {product.name}
        </h1>

        <p>
          {product.description}
        </p>

        <p>
          Category: {product.category?.name}
        </p>

        <p>
          Brand: {product.brand?.name}
        </p>
      </div>

      {/* Payment Settings */}
      <div className="rounded-lg border p-6 space-y-5">
        <h2 className="text-xl font-semibold">
          Payment Methods
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Cash on Delivery
            </p>

            <p className="text-sm text-muted-foreground">
              Allow customers to pay when delivered
            </p>
          </div>

          <Switch
              checked={allowCod}
              onCheckedChange={(value) => {
                setAllowCod(value);

                updatePayment(
                  "allowCod",
                  value
                );
              }}
            />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Online Payment
            </p>

            <p className="text-sm text-muted-foreground">
              Card, UPI, mobile money, etc.
            </p>
          </div>

          <Switch
            checked={allowOnlinePayment}
            onCheckedChange={(value) => {
              setAllowOnlinePayment(value);

              updatePayment(
                "allowOnlinePayment",
                value
              );
            }}
          />
        </div>
      </div>

      {/* Colors */}
      {product.colors.map((color) => (
        <div
          key={color.id}
          className="rounded-lg border p-6 space-y-5"
        >
          <h2 className="text-xl font-semibold">
            {color.name}
          </h2>

          {/* Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {color.images.map((image) => (
              <div
                key={image.id}
                className="relative h-40 rounded-md overflow-hidden border"
              >
                <Image
                  src={
                    image.imageUrl?.startsWith("http")
                      ? image.imageUrl
                      : "/placeholder.png"
                  }
                  alt={color.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <ProductVariantTable
            variants={color.variants}
          />
        </div>
      ))}
    </div>
  );
}