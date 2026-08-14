"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User as UserIcon, Menu, X, ShoppingBag, Heart, Globe, DollarSign, ShieldCheck, Search } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { getDictionary } from "@africasuk/i18n";

import Container from "../Container";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import OrdersButton from "./OrdersButton";
import WishlistButton from "./WishlistButton";
import CartButton from "./CartButton";
import LoginModal from "@/components/auth/LoginModal";
// import LanguageSwitcher from "./LanguageSwitcher";
import { CurrencySwitcher } from "@/components/currency/CurrencySwitcher";
import LogoutButton from "../topbar/LogoutButton";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

interface MainHeaderProps {
  user: User | null;
  dictionary: Dictionary;
}

export default function MainHeader({ user, dictionary }: MainHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsPinned(true);
      } else {
        setIsPinned(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 1. Main Header (Branding & Account) */}
      <header className="relative z-40 w-full bg-white antialiased select-none border-b border-gray-100">
        <Container>
          <div className="flex items-center justify-between gap-4 py-3 sm:py-3.5">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <Logo />
            </div>

            {/* Right: Actions & Account Control */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Regional Switchers */}
              <div className="hidden lg:flex items-center gap-1">
                {/* <LanguageSwitcher /> */}
                <CurrencySwitcher />
                <div className="h-6 w-px bg-gray-200 my-auto mx-2" />
              </div>

              {/* Personalization Navigation */}
              <div className="hidden md:flex items-center gap-1 sm:gap-1.5">
                <OrdersButton />
                <WishlistButton />
              </div>

              {/* Cart Trigger */}
              <CartButton />

              <div className="h-6 w-px bg-gray-200 my-auto mx-2 hidden md:block" />

              {/* User Identity Panel */}
              <div className="hidden md:flex items-center gap-1">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="group flex flex-col items-center justify-center gap-0.5 rounded-none px-2.5 py-1.5 text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-[#004d26]"
                      aria-label="Account"
                    >
                      <UserIcon className="h-4 w-4 stroke-[1.5]" />
                      <span className="text-[10px] font-medium tracking-wide">
                        {dictionary.common.myAccount}
                      </span>
                    </Link>
                    <LogoutButton />
                  </>
                ) : (
                  <LoginModal>
                    <div className="group flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-none px-2.5 py-1.5 text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-[#004d26]">
                      <UserIcon className="h-4 w-4 stroke-[1.5]" />
                      <span className="text-[10px] font-medium tracking-wide">
                        {dictionary.common.login}
                      </span>
                    </div>
                  </LoginModal>
                )}
              </div>

              {/* Mobile Navigation Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex md:hidden items-center justify-center p-2 rounded-none border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="h-4.5 w-4.5 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* 2. Sticky Search Bar */}
      <div
        className={`sticky top-0 z-40 w-full transition-all duration-200 ease-in-out antialiased border-b select-none ${
          isPinned
            ? "bg-white/95 backdrop-blur-md shadow-none py-2 border-gray-200"
            : "bg-white pb-3 pt-1 border-transparent"
        }`}
      >
        <Container>
          <div className="w-full flex justify-center transition-all duration-200 ease-in-out">
            <div
              className={`w-full transition-all duration-200 ease-in-out flex items-center ${
                isPinned ? "max-w-xl gap-2.5" : "max-w-2xl gap-0"
              }`}
            >
              {/* Mini Icon Link appearing when pinned */}
              <div
                className={`transition-all duration-200 ease-in-out overflow-hidden shrink-0 ${
                  isPinned ? "w-6 opacity-100" : "w-0 opacity-0"
                }`}
              >
                <Link href="/" aria-label="Home search">
                  <Search className="h-4.5 w-4.5 text-[#004d26] stroke-[1.5]" />
                </Link>
              </div>

              <div className="flex-1">
                <SearchBar />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 3. Slide-Out Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end select-none antialiased">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Frame */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-none flex flex-col transition-transform duration-200 z-10 animate-in slide-in-from-right overflow-hidden border-l border-gray-200 rounded-none">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#004d26] text-white shrink-0">
              <div className="brightness-0 invert scale-90 origin-left">
                <Logo />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-none text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </button>
            </div>

            {/* Navigation & Preferences */}
            <div className="flex flex-col flex-1 overflow-y-auto divide-y divide-gray-100">
              {/* Regional Preferences */}
              <div className="p-4 bg-gray-50/70 border-b border-gray-100 space-y-2.5">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-gray-500">
                  Regional Preferences
                </span>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="flex items-center gap-2 font-normal text-gray-700">
                      <Globe className="h-3.5 w-3.5 text-gray-500 shrink-0 stroke-[1.5]" /> Language
                    </span>
                    {/* <div className="scale-90 origin-right select-auto">
                      <LanguageSwitcher />
                    </div> */}
                  </div>

                  <div className="flex items-center justify-between gap-4 text-xs pt-1.5 border-t border-gray-200/60">
                    <span className="flex items-center gap-2 font-normal text-gray-700">
                      <DollarSign className="h-3.5 w-3.5 text-gray-500 shrink-0 stroke-[1.5]" /> Currency
                    </span>
                    <div className="scale-90 origin-right select-auto">
                      <CurrencySwitcher />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Hub */}
              <div className="p-4 space-y-2">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Account
                </span>

                {user ? (
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-2.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#004d26] transition-colors text-xs font-normal"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-gray-400 shrink-0 stroke-[1.5]" />
                      <span>{dictionary.common.myAccount}</span>
                    </Link>

                    <div className="px-2.5 py-1">
                      <LogoutButton />
                    </div>
                  </div>
                ) : (
                  <LoginModal>
                    <div className="flex items-center gap-3 w-full px-2.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#004d26] transition-colors text-xs font-normal cursor-pointer">
                      <UserIcon className="h-3.5 w-3.5 text-gray-400 shrink-0 stroke-[1.5]" />
                      <span>{dictionary.common.login}</span>
                    </div>
                  </LoginModal>
                )}
              </div>

              {/* Shop Actions */}
              <div className="p-4 space-y-2">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Shopping
                </span>

                <div className="space-y-1">
                  <Link
                    href="/account/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-2.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#004d26] transition-colors text-xs font-normal"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-gray-400 shrink-0 stroke-[1.5]" />
                    <span>Track Orders</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-2.5 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#004d26] transition-colors text-xs font-normal"
                  >
                    <Heart className="h-3.5 w-3.5 text-gray-400 shrink-0 stroke-[1.5]" />
                    <span>My Wishlist</span>
                  </Link>
                </div>
              </div>

              {/* Brand Footer Stamp */}
              <div className="p-4 mt-auto border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-2 text-[#004d26]">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 stroke-[1.5]" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-gray-600">
                    AfricaSuk Verified Commerce
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}