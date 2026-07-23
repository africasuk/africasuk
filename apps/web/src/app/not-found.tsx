import Link from "next/link";
import { MoveRight, Home, ShoppingBag, Search } from "lucide-react";
import Container from "@/components/layout/Container";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-white text-neutral-800 antialiased select-none relative overflow-hidden px-4">
      
      {/* Signature Brand Accent Line */}
      <div className="absolute top-0 left-0 h-1 w-full bg-[#002b15] overflow-hidden">
        <div 
          className="absolute inset-0 w-[200%] h-full bg-linear-to-r from-transparent via-[#00cc66] to-transparent animate-[shimmer_6s_infinite_linear]"
          style={{ backgroundSize: '50% 100%' }}
        />
      </div>

      <Container>
        <div className="max-w-xl mx-auto text-center flex flex-col items-center">
          
          {/* Big Error Code Styling */}
          <span className="text-[120px] font-extrabold tracking-tighter text-neutral-200/60 leading-none select-none sm:text-[160px]">
            404
          </span>

          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl mt-4">
            Page Not Found
          </h1>
          
          <p className="mt-4 text-sm text-neutral-500 max-w-sm leading-relaxed">
            The collection, hardware, or premium brand item you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>

          {/* Action Blocks */}
          <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <Link
              href="/"
              className="group flex items-center justify-between rounded-xl border border-neutral-200 p-4 transition-all duration-200 hover:bg-neutral-50 hover:border-[#004d26] active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-600 group-hover:bg-[#004d26]/10 group-hover:text-[#004d26] transition-colors">
                  <Home className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-neutral-950">Return Home</p>
                  <p className="text-[11px] text-neutral-400 font-medium">Back to storefront</p>
                </div>
              </div>
              <MoveRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-[#004d26]" />
            </Link>

            <Link
              href="/shop"
              className="group flex items-center justify-between rounded-xl border border-neutral-200 p-4 transition-all duration-200 hover:bg-neutral-50 hover:border-[#004d26] active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-600 group-hover:bg-[#004d26]/10 group-hover:text-[#004d26] transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-neutral-950">Browse Shop</p>
                  <p className="text-[11px] text-neutral-400 font-medium">Explore collections</p>
                </div>
              </div>
              <MoveRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-[#004d26]" />
            </Link>
          </div>

          {/* Inline Shimmer Keyframe Support for Server Component compatibility */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes shimmer {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0%); }
            }
          `}} />

        </div>
      </Container>
    </div>
  );
}