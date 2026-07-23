import Link from "next/link";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function WishlistEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border py-20 text-center">
      <Heart className="mb-4 h-16 w-16 text-muted-foreground" />

      <h2 className="text-2xl font-semibold">
        Your wishlist is empty
      </h2>

      <p className="mt-2 text-muted-foreground">
        Save products you love for later.
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