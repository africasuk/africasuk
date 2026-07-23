"use client";

import type { Order, Product } from "@africasuk/types";
import type { OrderItemDetails } from "@africasuk/api";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  order: Order;
  item: OrderItemDetails;
}

export function OrderItemDialog({ item }: Props) {
  const { item: orderItem, product, variant } = item;
  const subtotal = orderItem.price * orderItem.quantity;

  // 1. Updated image extraction mapping
  const images: string[] = [];

  const formatUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View Details
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-xl">
        <DialogHeader className="pr-6">
          <DialogTitle className="text-xl sm:text-2xl wrap-break-word line-clamp-2">
            {orderItem.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 sm:space-y-8 mt-4">
          {/* Main Grid */}
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-[320px_1fr]">
            
            {/* Image Showcase & Thumbnails */}
            <div className="space-y-4 max-w-md mx-auto lg:max-w-none w-full">
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted p-2">
                <div className="relative h-full w-full overflow-hidden rounded-lg">
                  {orderItem.image ? (
                    <Image
                      src={orderItem.image}
                      alt={orderItem.name}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 320px"
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Images Thumbnails Grid */}
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg border bg-muted overflow-hidden"
                  >
                    <Image
                      src={imgUrl}
                      alt={`${orderItem.name} thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
                {images.length === 0 &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg border bg-muted"
                    />
                  ))}
              </div>
            </div>

            {/* Details Container */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight wrap-break-word">
                  {orderItem.name}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Ordered Product
                </p>
              </div>

              <div className="rounded-xl border divide-y bg-card">
                <Info label="Quantity" value={String(orderItem.quantity)} />
                <Info
                    label="Unit Price"
                    value={formatUSD(orderItem.price)}
                  />
                <Info
                    label="Subtotal"
                    value={formatUSD(subtotal)}
                  />
              </div>
            </div>
          </div>

          {/* 2. Updated Selected Options Section */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold">
              Selected Options
            </h3>
            <div className="rounded-xl border divide-y bg-card">
              {variant ? (
                <>
                  <SpecRow
                    label={variant.optionName}
                    value={variant.optionValue}
                  />
                  <SpecRow label="SKU" value={variant.sku ?? "-"} />
                </>
              ) : (
                <div className="p-4 sm:p-5 text-sm text-muted-foreground">
                  No options available.
                </div>
              )}
            </div>
          </section>

          {/* Description */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold">
              Description
            </h3>
            <div className="rounded-xl border p-4 sm:p-5 text-xs sm:text-sm whitespace-pre-line text-muted-foreground bg-card wrap-break-word">
              {product?.description ?? "-"}
            </div>
          </section>
          {/* Specifications */}
          <section className="space-y-3">
            <h3 className="text-base sm:text-lg font-semibold">
              Specifications
            </h3>
            <div className="rounded-xl border divide-y bg-card">
              <SpecRow
                label="Brand"
                value={
                  (
                    product as Product & {
                      brand?: { name: string };
                    }
                  ).brand?.name ?? "-"
                }
              />
              <SpecRow
                label="Category"
                value={
                  (
                    product as Product & {
                      category?: { name: string };
                    }
                  ).category?.name ?? "-"
                }
              />
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface InfoProps {
  label: string;
  value: string;
}

function Info({ label, value }: InfoProps) {
  return (
    <div className="flex items-center justify-between border-b px-4 sm:px-5 py-3 sm:py-4 last:border-b-0 text-sm">
      <span className="text-muted-foreground mr-2">{label}</span>
      <span className="font-semibold text-right break-all">{value}</span>
    </div>
  );
}

interface SpecRowProps {
  label: string;
  value: string;
}

function SpecRow({ label, value }: SpecRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] md:grid-cols-[180px_1fr] gap-1 sm:gap-4 px-4 sm:px-5 py-3 text-sm">
      <span className="text-muted-foreground font-medium sm:font-normal">
        {label}
      </span>
      <span className="wrap-break-word text-foreground">{value}</span>
    </div>
  );
}