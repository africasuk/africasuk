"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  productId: string;
  name: string;
}

export function ProductDetailsHeader({
  productId,
  name,
}: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <h1 className="mt-4 text-2xl font-bold">
          {name}
        </h1>
      </div>

      <Button asChild>
        <Link href={`/products/${productId}/edit`}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Product
        </Link>
      </Button>
    </div>
  );
}