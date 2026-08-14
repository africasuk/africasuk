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
          text: product.description ?? `Check out ${product.name} on AfricasUK`,
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
    <div className="space-y-2.5 select-none antialiased">
      {/* Category / Brand & Action Controls Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-normal">
          {product.category && (
            <span className="hover:text-gray-800 transition-colors">
              {product.category.name}
            </span>
          )}
          {product.brand && product.category && (
            <span className="text-gray-300">•</span>
          )}
          {product.brand && (
            <span className="font-medium text-gray-700">
              {product.brand.name}
            </span>
          )}
        </div>

        {/* Share & Copy Action Triggers */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Web Share Trigger */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex h-7 items-center gap-1.5 rounded-none border border-gray-200 bg-white px-2 sm:px-2.5 text-[11px] font-normal text-gray-600 shadow-none transition-colors duration-150 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 cursor-pointer"
            aria-label="Share product"
          >
            <Share2 className="h-3 w-3 text-gray-400 stroke-[1.5]" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Direct Copy Link Trigger */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`flex h-7 items-center gap-1.5 rounded-none border px-2 sm:px-2.5 text-[11px] font-normal shadow-none transition-colors duration-150 cursor-pointer ${
              copied
                ? "border-[#004d26] bg-[#004d26] text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900"
            }`}
            aria-label="Copy product link"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-white stroke-2" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-gray-400 stroke-[1.5]" />
                <span className="hidden sm:inline">Copy link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Title */}
      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 leading-snug">
        {product.name}
      </h1>

      {/* Description */}
      {product.description && (
        <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed max-w-prose">
          {product.description}
        </p>
      )}
    </div>
  );
}