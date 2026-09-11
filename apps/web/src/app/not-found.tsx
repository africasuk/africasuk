import Link from "next/link";
import { MoveRight, Home, ShoppingBag } from "lucide-react";
import Container from "@/components/layout/Container";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] select-none flex-col items-center justify-center overflow-hidden bg-white px-4 text-neutral-800 antialiased">
      {/* Brand Accent Line */}
      <div className="absolute left-0 top-0 h-1 w-full overflow-hidden bg-[#002b15]">
        <div
          className="absolute inset-0 h-full w-[200%] animate-[shimmer_6s_infinite_linear] bg-linear-to-r from-transparent via-[#00cc66] to-transparent"
          style={{ backgroundSize: "50% 100%" }}
        />
      </div>

      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          {/* Error Code */}
          <span className="select-none text-[120px] font-extrabold leading-none tracking-tighter text-neutral-200/60 sm:text-[160px]">
            404
          </span>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Page Not Found
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
            The page or product you are looking for may have been moved,
            renamed, or is currently unavailable.
          </p>

          {/* Actions */}
          <div className="mt-10 grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Home */}
            <Link
              href="/"
              className="group flex items-center justify-between rounded-xl border border-neutral-200 p-4 transition-all duration-200 hover:border-[#004d26] hover:bg-neutral-50 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-600 transition-colors group-hover:bg-[#004d26]/10 group-hover:text-[#004d26]">
                  <Home className="h-5 w-5" />
                </div>

                <div className="text-left">
                  <p className="text-xs font-semibold text-neutral-950">
                    Return Home
                  </p>
                  <p className="text-[11px] font-medium text-neutral-400">
                    Back to Africa Suk
                  </p>
                </div>
              </div>

              <MoveRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-[#004d26]" />
            </Link>

            {/* Shop */}
            <Link
              href="/shop"
              className="group flex items-center justify-between rounded-xl border border-neutral-200 p-4 transition-all duration-200 hover:border-[#004d26] hover:bg-neutral-50 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-50 text-neutral-600 transition-colors group-hover:bg-[#004d26]/10 group-hover:text-[#004d26]">
                  <ShoppingBag className="h-5 w-5" />
                </div>

                <div className="text-left">
                  <p className="text-xs font-semibold text-neutral-950">
                    Browse Products
                  </p>
                  <p className="text-[11px] font-medium text-neutral-400">
                    Explore Africa Suk
                  </p>
                </div>
              </div>

              <MoveRight className="h-4 w-4 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-[#004d26]" />
            </Link>
          </div>

          {/* Shimmer Animation */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @keyframes shimmer {
                  0% {
                    transform: translateX(-50%);
                  }
                  100% {
                    transform: translateX(0%);
                  }
                }
              `,
            }}
          />
        </div>
      </Container>
    </div>
  );
}