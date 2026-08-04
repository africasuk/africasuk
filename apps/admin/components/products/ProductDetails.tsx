"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductWithDetails } from "@africasuk/types";

import { ProductVariantTable } from "./ProductVariantTable";
import { Switch } from "@/components/ui/switch";

interface Props {
  product: ProductWithDetails;
}

export function ProductDetails({ product }: Props) {
  const [allowCod, setAllowCod] = useState(product.allowCod);

  const [allowOnlinePayment, setAllowOnlinePayment] = useState(
    product.allowOnlinePayment
  );

  const updatePayment = async (
    field: "allowCod" | "allowOnlinePayment",
    value: boolean
  ) => {
    const newAllowCod = field === "allowCod" ? value : allowCod;

    const newAllowOnlinePayment =
      field === "allowOnlinePayment" ? value : allowOnlinePayment;

    await fetch(`/api/products/${product.id}/payment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        allowCod: newAllowCod,
        allowOnlinePayment: newAllowOnlinePayment,
      }),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 w-full max-w-7xl mx-auto px-1 sm:px-0">
      
      {/* Basic Info Card */}
      <div className="rounded-lg sm:rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-2xs">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight">
            {product.name}
          </h1>
          {product.description && (
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Category & Brand Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 text-xs sm:text-sm">
          {product.category?.name && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 font-medium text-neutral-700">
              <span className="text-neutral-400">Category:</span>
              <span>{product.category.name}</span>
            </div>
          )}

          {product.brand?.name && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 font-medium text-neutral-700">
              <span className="text-neutral-400">Brand:</span>
              <span>{product.brand.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Settings Card */}
      <div className="rounded-lg sm:rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xs">
        <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">
          Payment Methods
        </h2>

        <div className="space-y-4">
          {/* COD Toggle */}
          <div className="flex items-center justify-between gap-4 py-1">
            <div className="space-y-0.5">
              <p className="text-sm sm:text-base font-medium text-neutral-900">
                Cash on Delivery
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Allow customers to pay when delivered
              </p>
            </div>

            <Switch
              checked={allowCod}
              onCheckedChange={(value) => {
                setAllowCod(value);
                updatePayment("allowCod", value);
              }}
            />
          </div>

          <div className="h-px bg-neutral-100 w-full" />

          {/* Online Payment Toggle */}
          <div className="flex items-center justify-between gap-4 py-1">
            <div className="space-y-0.5">
              <p className="text-sm sm:text-base font-medium text-neutral-900">
                Online Payment
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Card, UPI, mobile money, etc.
              </p>
            </div>

            <Switch
              checked={allowOnlinePayment}
              onCheckedChange={(value) => {
                setAllowOnlinePayment(value);
                updatePayment("allowOnlinePayment", value);
              }}
            />
          </div>
        </div>
      </div>

      {/* Colors & Variants List */}
      {product.colors.map((color) => (
        <div
          key={color.id}
          className="rounded-lg sm:rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">
              Color: {color.name}
            </h2>
          </div>

          {/* Responsive Gallery Grid */}
          {color.images && color.images.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Gallery ({color.images.length})
              </p>
              
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-4">
                {color.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200/80 bg-neutral-50 group"
                  >
                    <Image
                      src={
                        image.imageUrl?.startsWith("http")
                          ? image.imageUrl
                          : "/placeholder.png"
                      }
                      alt={color.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variant Table Wrapper (Horizontal Scroll Safe for Mobile Viewports) */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Variants & Stock
            </p>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <ProductVariantTable variants={color.variants} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}