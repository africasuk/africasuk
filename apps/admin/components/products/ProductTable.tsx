"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { ProductWithDetails } from "@africasuk/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  products: ProductWithDetails[];
}

// Helper to truncate text to a maximum word count
function truncateWords(text?: string | null, wordLimit: number = 3): string {
  if (!text) return "-";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return `${words.slice(0, wordLimit).join(" ")}...`;
}

export function ProductTable({ products }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product.");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-2xs">
        No products found.
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* ------------------------------------------------------------- */}
      {/* 1. MOBILE CARD VIEW (Visible on screens smaller than md)      */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {products.map((product) => {
          const thumbnail =
            product.colors[0]?.images[0]?.imageUrl?.startsWith("http")
              ? product.colors[0].images[0].imageUrl
              : "/placeholder.png";

          const colorCount = product.colors.length;
          const variantCount = product.colors.reduce(
            (total, color) => total + color.variants.length,
            0
          );

          return (
            <div
              key={product.id}
              className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-2xs gap-3"
            >
              <div className="flex items-start gap-3">
                {/* Product Image */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                  <Image
                    src={thumbnail}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2" title={product.name}>
                      {product.name}
                    </h3>
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className="shrink-0 text-[10px] px-1.5 py-0.5"
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {/* 3-word truncated description */}
                  <p className="text-xs text-muted-foreground truncate" title={product.description ?? ""}>
                    {truncateWords(product.description, 3)}
                  </p>

                  <p className="text-xs text-muted-foreground truncate">
                    {product.category?.name ?? "No Category"} • {product.brand?.name ?? "No Brand"}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
                    <span>
                      Colors: <strong className="text-foreground">{colorCount}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Variants: <strong className="text-foreground">{variantCount}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <Link href={`/products/${product.id}`} className="flex-1 sm:flex-none">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </Button>
                </Link>

                <Link href={`/products/${product.id}/edit`} className="flex-1 sm:flex-none">
                  <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deletingId === product.id}
                  onClick={() => handleDelete(product.id)}
                  className="gap-1.5 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Delete</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TABLE VIEW (Visible on tablet & desktop screens md+)        */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:block rounded-lg border border-border bg-card text-card-foreground shadow-2xs overflow-hidden">
        {/* table-fixed allows column width classes to be strictly respected */}
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="w-16">Image</TableHead>
              <TableHead className="w-[28%]">Product</TableHead>
              <TableHead className="w-[18%]">Description</TableHead>
              <TableHead className="w-[14%]">Category</TableHead>
              <TableHead className="w-[12%]">Brand</TableHead>
              <TableHead className="w-16 text-center">Colors</TableHead>
              <TableHead className="w-16 text-center">Variants</TableHead>
              <TableHead className="w-20">Status</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => {
              const thumbnail =
                product.colors[0]?.images[0]?.imageUrl?.startsWith("http")
                  ? product.colors[0].images[0].imageUrl
                  : "/placeholder.png";

              const colorCount = product.colors.length;
              const variantCount = product.colors.reduce(
                (total, color) => total + color.variants.length,
                0
              );

              return (
                <TableRow key={product.id} className="border-border hover:bg-muted/50">
                  <TableCell className="w-16">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border bg-muted">
                      <Image
                        src={thumbnail}
                        alt={product.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  </TableCell>

                  {/* Product Name truncated cleanly if too long */}
                  <TableCell className="font-medium">
                    <span className="line-clamp-2 text-sm leading-tight" title={product.name}>
                      {product.name}
                    </span>
                  </TableCell>

                  {/* 3-word truncated description */}
                  <TableCell className="text-muted-foreground text-sm">
                    <span className="truncate block" title={product.description ?? ""}>
                      {truncateWords(product.description, 3)}
                    </span>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm">
                    <span className="truncate block" title={product.category?.name ?? ""}>
                      {product.category?.name ?? "-"}
                    </span>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm">
                    <span className="truncate block" title={product.brand?.name ?? ""}>
                      {product.brand?.name ?? "-"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center text-sm">{colorCount}</TableCell>

                  <TableCell className="text-center text-sm">{variantCount}</TableCell>

                  <TableCell>
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className="text-[11px] px-2 py-0.5"
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/products/${product.id}`}>
                        <Button size="icon" variant="outline" className="h-7 w-7">
                          <Eye className="h-3.5 w-3.5" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>

                      <Link href={`/products/${product.id}/edit`}>
                        <Button size="icon" variant="outline" className="h-7 w-7">
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>

                      <Button
                        size="icon"
                        variant="destructive"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product.id)}
                        className="h-7 w-7"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}