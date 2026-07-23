"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  inStock: boolean;
}

interface Props {
  items: WishlistItem[];
}

export default function Wishlist({
  items,
}: Props) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Wishlist
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Products you&apos;ve saved for later.
          </p>
        </div>

        <Link
          href="/wishlist"
          className="text-sm font-semibold text-[#004d26] hover:underline"
        >
          View All
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed py-14 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />

          <h3 className="mt-4 text-lg font-semibold">
            Your wishlist is empty
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Save products you love and they&apos;ll appear here.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex rounded-xl bg-[#004d26] px-5 py-3 font-semibold text-white hover:bg-[#003b1d]"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border p-4 transition hover:border-[#004d26]/30 md:flex-row md:items-center"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative h-24 w-24 overflow-hidden rounded-xl border"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </Link>

              <div className="flex-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-semibold hover:text-[#004d26]"
                >
                  {item.name}
                </Link>

                <div className="mt-2 flex items-center gap-2">
                  <span className="font-bold">
                    {item.currency}{" "}
                    {item.price.toFixed(2)}
                  </span>

                  {item.compareAtPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {item.currency}{" "}
                      {item.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      item.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.inStock
                      ? "In Stock"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-[#004d26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003b1d]"
                  disabled={!item.inStock}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>

                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}