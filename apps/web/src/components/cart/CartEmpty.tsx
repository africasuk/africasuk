import Link from "next/link";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border py-20 text-center">
      <ShoppingCart className="mb-4 h-16 w-16 text-muted-foreground" />

      <h2 className="text-2xl font-semibold">
        Your cart is empty
      </h2>

      <p className="mt-2 text-muted-foreground">
        Start shopping and add your
        favorite products.
      </p>

      <Button
        asChild
        className="mt-6"
      >
        <Link href="/">
          Continue Shopping
        </Link>
      </Button>
    </div>
  );
}