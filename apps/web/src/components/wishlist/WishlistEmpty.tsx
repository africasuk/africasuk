import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistEmpty() {
  return (
    <div className="flex flex-col items-center justify-center border border-gray-200 bg-white py-16 sm:py-24 px-6 text-center select-none antialiased shadow-none rounded-none">
      {/* Icon Frame */}
      <div className="flex h-12 w-12 items-center justify-center border border-gray-200 bg-gray-50 mb-4 text-gray-400">
        <Heart className="h-5 w-5 stroke-[1.5]" />
      </div>

      {/* Heading & Subtext */}
      <h2 className="text-base sm:text-lg font-semibold tracking-tight text-gray-900">
        Your wishlist is empty
      </h2>

      <p className="mt-1 text-xs sm:text-sm text-gray-500 font-normal max-w-xs leading-relaxed">
        Save pieces you love to build your personal collection and revisit them later.
      </p>

      {/* Action Button */}
      <Button
        asChild
        className="mt-6 h-10 px-6 rounded-none bg-[#004d26] hover:bg-[#00361a] text-white text-xs font-medium uppercase tracking-wider shadow-none transition-colors duration-150"
      >
        <Link href="/products" className="inline-flex items-center gap-2">
          <span>Start Exploring</span>
          <ArrowRight className="h-3.5 w-3.5 stroke-[1.5]" />
        </Link>
      </Button>
    </div>
  );
}