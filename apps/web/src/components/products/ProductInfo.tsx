"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import type { ProductWithDetails } from "@africasuk/types";

interface Props {
  product: ProductWithDetails;
}

export function ProductInfo({ product }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description ?? `Check out ${product.name} on AfricaSuk`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed silently
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-3 select-none antialiased">
      {/* Category / Brand & Action Controls Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
          {product.category && (
            <span className="transition-colors hover:text-zinc-900">
              {product.category.name}
            </span>
          )}
          {product.brand && product.category && (
            <span className="text-zinc-300">•</span>
          )}
          {product.brand && (
            <span className="font-semibold text-zinc-800">
              {product.brand.name}
            </span>
          )}
        </div>

        {/* Share & Copy Action Triggers */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Web Share Trigger */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 active:scale-95"
            aria-label="Share product"
          >
            <Share2 className="h-3.5 w-3.5 text-zinc-500" strokeWidth={1.8} />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Direct Copy Link Trigger */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition active:scale-95 ${
              copied
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
            }`}
            aria-label="Copy product link"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-500" strokeWidth={1.8} />
                <span className="hidden sm:inline">Copy link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Title */}
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 leading-snug sm:text-3xl">
        {product.name}
      </h1>

      {/* Description */}
      {product.description && (
        <p className="max-w-prose text-xs leading-relaxed text-zinc-600 sm:text-sm">
          {product.description}
        </p>
      )}
    </div>
  );
}