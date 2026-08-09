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
    <div className="space-y-3.5 select-none antialiased">
      {/* Category / Sub-header & Action Controls Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          {product.category && <span>{product.category.name}</span>}
          {product.brand && product.category && <span>•</span>}
          {product.brand && <span>{product.brand.name}</span>}
        </div>

        {/* Share & Copy Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Web Share Trigger */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="group flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-2xs transition-all duration-200 hover:border-[#005c2e]/40 hover:bg-gray-50 hover:text-[#002b15] active:scale-95 cursor-pointer"
            aria-label="Share product"
          >
            <Share2 className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#002b15] transition-colors" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* Direct Copy Link Trigger */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`group flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium shadow-2xs transition-all duration-200 active:scale-95 cursor-pointer ${
              copied
                ? "border-transparent bg-[#002b15] text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-[#005c2e]/40 hover:bg-gray-50 hover:text-[#002b15]"
            }`}
            aria-label="Copy product link"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#002b15] transition-colors" />
                <span className="hidden sm:inline">Copy link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Title */}
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight leading-snug">
        {product.name}
      </h1>

      {/* Description */}
      {product.description && (
        <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-md font-normal">
          {product.description}
        </p>
      )}
    </div>
  );
}