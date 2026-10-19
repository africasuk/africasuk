"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { User as UserIcon, Search } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { getDictionary } from "@africasuk/i18n";

import Container from "../Container";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import OrdersButton from "./OrdersButton";
import WishlistButton from "./WishlistButton";
import CartButton from "./CartButton";
import { CurrencySwitcher } from "@/components/currency/CurrencySwitcher";
import LogoutButton from "../topbar/LogoutButton";
import MobileMenu from "./MobileMenu";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

interface MainHeaderProps {
  user: User | null;
  dictionary: Dictionary;
}

export default function MainHeader({ user, dictionary }: MainHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  const closeMobileSearch = useCallback(() => {
    setIsMobileSearchActive(false);
  }, []);

  // Listen to menu open events from bottom navigation
  useEffect(() => {
    const openMenu = () => {
      setIsMobileSearchActive(false);
      setIsMobileMenuOpen(true);
    };

    window.addEventListener("africasuk:open-mobile-menu", openMenu);

    return () => {
      window.removeEventListener("africasuk:open-mobile-menu", openMenu);
    };
  }, []);

  // Handle scroll trigger for pinned styling
  useEffect(() => {
    const handleScroll = () => {
      setIsPinned(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Escape key closes mobile search overlay
  useEffect(() => {
    if (!isMobileSearchActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileSearch();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileSearchActive, closeMobileSearch]);

  return (
    <>
      {/* ============================================================ */}
      {/* MOBILE / TABLET HEADER                                       */}
      {/* ============================================================ */}
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 w-full antialiased transition-colors duration-200 lg:hidden",
          isMobileSearchActive
            ? "border-b border-gray-200 bg-white shadow-md"
            : isPinned
              ? "border-b border-gray-100 bg-white/95 shadow-xs backdrop-blur-md"
              : "border-b-0 border-transparent bg-transparent shadow-none",
        ].join(" ")}
      >
        <Container>
          <div
            className={[
              "flex w-full items-center gap-2 transition-all duration-200",
              isPinned || isMobileSearchActive ? "py-2" : "py-2.5",
            ].join(" ")}
          >
            {/* Logo */}
            {!isMobileSearchActive && (
              <div className="shrink-0 transition-transform active:scale-95">
                <Logo iconOnly />
              </div>
            )}

            {/* Mobile Search Input */}
            <div
              className={[
                "min-w-0 flex-1 transition-all duration-200",
                isMobileSearchActive ? "w-full" : "",
              ].join(" ")}
            >
              <SearchBar
                mobileExpanded={isMobileSearchActive}
                onMobileExpandedChange={setIsMobileSearchActive}
              />
            </div>

            {/* Right Action Icons (Dynamic White on Top, Black on Scroll) */}
            {!isMobileSearchActive && (
              <div
                className={[
                  "flex shrink-0 items-center gap-1 transition-colors duration-200",
                  !isPinned
                    ? "text-white [&_svg]:text-white [&_svg]:drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
                    : "text-neutral-900 [&_svg]:text-neutral-900 [&_svg]:drop-shadow-none",
                ].join(" ")}
              >
                <WishlistButton showLabel={false} />
                <CartButton showLabel={false} />
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Spacer to push content down only when pinned or search is expanded */}
      {(isPinned || isMobileSearchActive) && (
        <div className="h-14 lg:hidden" aria-hidden="true" />
      )}

      {/* ============================================================ */}
      {/* DESKTOP HEADER                                               */}
      {/* ============================================================ */}
      <div className="hidden lg:block">
        <header className="relative z-40 w-full border-b border-gray-100 bg-white antialiased">
          <Container>
            <div className="flex items-center justify-between gap-4 py-3 sm:py-3.5">
              <div className="flex shrink-0 items-center gap-3">
                <Logo />
              </div>

              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                <div className="hidden items-center gap-1 lg:flex">
                  <CurrencySwitcher />
                  <div className="mx-2 my-auto h-6 w-px bg-gray-200" />
                </div>

                <div className="hidden items-center gap-1 sm:gap-1.5 md:flex">
                  <OrdersButton />
                  <WishlistButton />
                </div>

                <CartButton />

                <div className="mx-2 my-auto hidden h-6 w-px bg-gray-200 md:block" />

                <div className="hidden items-center gap-1 md:flex">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        aria-label="Account"
                        className="group flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#004d26]"
                      >
                        <UserIcon className="h-4 w-4 stroke-[1.5]" />
                        <span className="text-[10px] font-medium tracking-wide">
                          {dictionary.common.myAccount}
                        </span>
                      </Link>
                      <LogoutButton />
                    </>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="group flex cursor-pointer flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#004d26]"
                    >
                      <UserIcon className="h-4 w-4 stroke-[1.5]" />
                      <span className="text-[10px] font-medium tracking-wide">
                        {dictionary.common.login}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </header>

        {/* Desktop sticky search */}
        <div
          className={[
            "sticky top-0 z-40 w-full border-b antialiased transition-all duration-200",
            isPinned
              ? "border-gray-200 bg-white/95 py-2 backdrop-blur-md"
              : "border-transparent bg-white pb-3 pt-1",
          ].join(" ")}
        >
          <Container>
            <div className="flex w-full justify-center">
              <div
                className={[
                  "flex w-full items-center transition-all duration-200",
                  isPinned ? "max-w-xl gap-2.5" : "max-w-2xl gap-0",
                ].join(" ")}
              >
                <div
                  className={[
                    "shrink-0 overflow-hidden transition-all duration-200",
                    isPinned ? "w-6 opacity-100" : "w-0 opacity-0",
                  ].join(" ")}
                >
                  <Link href="/" aria-label="Home search">
                    <Search className="h-4 w-4 stroke-[1.5] text-[#004d26]" />
                  </Link>
                </div>

                <div className="min-w-0 flex-1">
                  <SearchBar />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      <MobileMenu
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        dictionary={dictionary}
      />
    </>
  );
}