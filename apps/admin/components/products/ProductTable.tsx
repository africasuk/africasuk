"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";

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

function truncateWords(text?: string | null, wordLimit: number = 3): string {
  if (!text) return "-";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordLimit) return text;
  return `${words.slice(0, wordLimit).join(" ")}...`;
}

export function ProductTable({ products }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Tracks which specific action on which product is in-flight
  const [activeNav, setActiveNav] = useState<{
    id: string;
    action: "view" | "edit";
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isAnyActionActive = isPending || deletingId !== null;

  const handleNavigate = (id: string, action: "view" | "edit") => {
    setActiveNav({ id, action });
    startTransition(() => {
      const destination = action === "view" ? `/products/${id}` : `/products/${id}/edit`;
      router.push(destination);
    });
  };

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

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
      {/* 1. MOBILE CARD VIEW (Phones < md)                             */}
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

          const isViewing =
            isPending && activeNav?.id === product.id && activeNav?.action === "view";
          const isEditing =
            isPending && activeNav?.id === product.id && activeNav?.action === "edit";
          const isDeleting = deletingId === product.id;

          return (
            <div
              key={product.id}
              className={`flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-2xs gap-3 transition-opacity ${
                isDeleting ? "opacity-50" : ""
              }`}
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
                    <h3
                      className="font-semibold text-sm text-foreground line-clamp-2"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className="shrink-0 text-[10px] px-1.5 py-0.5"
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <p
                    className="text-xs text-muted-foreground truncate"
                    title={product.description ?? ""}
                  >
                    {truncateWords(product.description, 3)}
                  </p>

                  <p className="text-xs text-muted-foreground truncate">
                    {product.category?.name ?? "No Category"} •{" "}
                    {product.brand?.name ?? "No Brand"}
                  </p>

                  <div className="flex items-center gap-2 pt-0.5 text-xs text-muted-foreground flex-wrap">
                    <span>
                      Colors: <strong className="text-foreground">{colorCount}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Variants:{" "}
                      <strong className="text-foreground">{variantCount}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Optimized for touch screens */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isAnyActionActive}
                  onClick={() => handleNavigate(product.id, "view")}
                  className="flex-1 h-9 text-xs gap-1.5"
                >
                  {isViewing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                  <span>View</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={isAnyActionActive}
                  onClick={() => handleNavigate(product.id, "edit")}
                  className="flex-1 h-9 text-xs gap-1.5"
                >
                  {isEditing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Pencil className="h-3.5 w-3.5" />
                  )}
                  <span>Edit</span>
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={isAnyActionActive}
                  onClick={() => handleDelete(product.id)}
                  className="h-9 px-3 text-xs gap-1.5 shrink-0"
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  <span className="sr-only sm:not-sr-only">Delete</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TABLE VIEW (Desktop & Tablet md+)                          */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:block rounded-lg border border-border bg-card text-card-foreground shadow-2xs overflow-hidden">
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

              const isViewing =
                isPending && activeNav?.id === product.id && activeNav?.action === "view";
              const isEditing =
                isPending && activeNav?.id === product.id && activeNav?.action === "edit";
              const isDeleting = deletingId === product.id;

              return (
                <TableRow
                  key={product.id}
                  className={`border-border hover:bg-muted/50 transition-opacity ${
                    isDeleting ? "opacity-50" : ""
                  }`}
                >
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

                  <TableCell className="font-medium">
                    <span
                      className="line-clamp-2 text-sm leading-tight"
                      title={product.name}
                    >
                      {product.name}
                    </span>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm">
                    <span
                      className="truncate block"
                      title={product.description ?? ""}
                    >
                      {truncateWords(product.description, 3)}
                    </span>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm">
                    <span
                      className="truncate block"
                      title={product.category?.name ?? ""}
                    >
                      {product.category?.name ?? "-"}
                    </span>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm">
                    <span
                      className="truncate block"
                      title={product.brand?.name ?? ""}
                    >
                      {product.brand?.name ?? "-"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center text-sm">
                    {colorCount}
                  </TableCell>

                  <TableCell className="text-center text-sm">
                    {variantCount}
                  </TableCell>

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
                      <Button
                        size="icon"
                        variant="outline"
                        disabled={isAnyActionActive}
                        onClick={() => handleNavigate(product.id, "view")}
                        className="h-7 w-7"
                        title="View Product"
                      >
                        {isViewing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">View</span>
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        disabled={isAnyActionActive}
                        onClick={() => handleNavigate(product.id, "edit")}
                        className="h-7 w-7"
                        title="Edit Product"
                      >
                        {isEditing ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Pencil className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">Edit</span>
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        disabled={isAnyActionActive}
                        onClick={() => handleDelete(product.id)}
                        className="h-7 w-7"
                        title="Delete Product"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
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