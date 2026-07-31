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
   <div className="mb-6 flex items-center justify-between">
      <div>
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <h1 className="mt-4 text-2xl font-bold">
          {name}
        </h1>
      </div>

      <Link href={`/products/${productId}/edit`}>
        <Button>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Product
        </Button>
      </Link>
    </div>
  );
}