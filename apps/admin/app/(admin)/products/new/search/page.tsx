"use client";

import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";

import type { Product } from "@africasuk/types";

import PageHeader from "@/components/shared/PageHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SearchProductPage() {
  const [query, setQuery] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [results, setResults] =
    useState<Product[]>([]);

  async function handleSearch(
    value: string
  ) {
    setQuery(value);

    const search = value.trim();

    if (!search) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/products/search?q=${encodeURIComponent(
          search
        )}`
      );

      if (!response.ok) {
        throw new Error();
      }

      const data: Product[] =
        await response.json();

      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Search Product"
        description="Search products already available in AfricaSuk."
      />

      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(e) =>
                handleSearch(
                  e.target.value
                )
              }
              placeholder="Search by name, SKU or barcode..."
              className="pl-10"
            />
          </div>

          {!query && (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              Start typing to search products.
            </div>
          )}

          {loading && (
            <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!loading &&
            query &&
            results.length === 0 && (
              <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                No products found.
              </div>
            )}

          <div className="space-y-4">
            {results.map((product) => (
              <Card key={product.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="space-y-1">
                    <h3 className="font-semibold">
                      {product.name}
                    </h3>
                  </div>

                  <Button asChild>
                    <Link
                      href={`/products/${product.id}/edit`}
                    >
                      Open
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}