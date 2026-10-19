"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Grid2X2, House, Menu, Package, LoaderCircle } from "lucide-react";

const tabs = [
  { label: "Home", href: "/", Icon: House },
  { label: "Categories", href: "/categories", Icon: Grid2X2 },
  { label: "Orders", href: "/account/orders", Icon: Package },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [requestedHref, setRequestedHref] = useState<string | null>(null);

  const loadingHref =
    requestedHref && requestedHref !== pathname ? requestedHref : null;

  function navigate(href: string) {
    if (href === pathname || pathname.startsWith(`${href}/`)) return;
    if (requestedHref) return;

    setRequestedHref(href);
    router.push(href);
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-[calc(12px+env(safe-area-inset-bottom))] left-4 right-4 z-60 lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around rounded-[32px] border border-black/10 bg-white/95 px-2 shadow-[0_4px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        {tabs.map(({ label, href, Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          const loading = loadingHref === href;

          return (
            <button
              key={href}
              type="button"
              onClick={() => navigate(href)}
              aria-current={active ? "page" : undefined}
              aria-label={loading ? `Loading ${label}` : label}
              disabled={loadingHref !== null}
              className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 disabled:opacity-80"
            >
              <span
                className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
                  active ? "bg-black/[0.07]" : ""
                }`}
              >
                {loading ? (
                  <LoaderCircle
                    size={23}
                    className="animate-spin text-[#111111]"
                  />
                ) : (
                  <Icon
                    size={23}
                    strokeWidth={active ? 2.5 : 1.8}
                    className={active ? "text-[#111111]" : "text-zinc-500"}
                  />
                )}
              </span>

              <span
                className={`text-[10px] ${
                  active
                    ? "font-extrabold text-[#111111]"
                    : "font-semibold text-zinc-500"
                }`}
              >
                {loading ? "Loading..." : label}
              </span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => navigate("/menu")}
          aria-label="Open menu"
          aria-current={pathname === "/menu" ? "page" : undefined}
          disabled={loadingHref !== null}
          className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-1.5 disabled:opacity-80"
        >
          <span
            className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${
              pathname === "/menu" ? "bg-black/[0.07]" : ""
            }`}
          >
            {loadingHref === "/menu" ? (
              <LoaderCircle
                size={23}
                className="animate-spin text-[#111111]"
              />
            ) : (
              <Menu
                size={23}
                strokeWidth={pathname === "/menu" ? 2.5 : 1.8}
                className={
                  pathname === "/menu" ? "text-[#111111]" : "text-zinc-500"
                }
              />
            )}
          </span>

          <span
            className={`text-[10px] ${
              pathname === "/menu"
                ? "font-extrabold text-[#111111]"
                : "font-semibold text-zinc-500"
            }`}
          >
            {loadingHref === "/menu" ? "Loading..." : "Menu"}
          </span>
        </button>
      </div>
    </nav>
  );
}