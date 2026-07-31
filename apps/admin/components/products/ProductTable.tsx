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

  return (
    <div className="rounded-md border border-border bg-card text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-muted/50">
            <TableHead className="w-20">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead className="text-center">Colors</TableHead>
            <TableHead className="text-center">Variants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                <TableCell>
                  <div className="relative h-14 w-14 overflow-hidden rounded-md border border-border bg-muted">
                    <Image
                      src={thumbnail}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell className="font-medium">{product.name}</TableCell>

                <TableCell className="text-muted-foreground">
                  {product.category?.name ?? "-"}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {product.brand?.name ?? "-"}
                </TableCell>

                <TableCell className="text-center">{colorCount}</TableCell>

                <TableCell className="text-center">{variantCount}</TableCell>

                <TableCell>
                  <Badge
                    variant={product.isActive ? "default" : "secondary"}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/products/${product.id}`}>
                        <Button size="icon" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Link href={`/products/${product.id}/edit`}>
                        <Button size="icon" variant="outline">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Button
                        size="icon"
                        variant="destructive"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
              </TableRow>
            );
          })}

          {products.length === 0 && (
            <TableRow className="border-border">
              <TableCell
                colSpan={8}
                className="h-24 text-center text-muted-foreground"
              >
                No products found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}