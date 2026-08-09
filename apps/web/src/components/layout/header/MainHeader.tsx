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

// Awaited unwraps the Promise returned by getDictionary
type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

interface MainHeaderProps {
  user: User | null;
  dictionary: Dictionary;
}

export default function MainHeader({ user, dictionary }: MainHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Logic to handle "Smart Sticky" search bar on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Pin the search bar after scrolling past the main logo area (approx 70px)
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
      {/* 1. Main Header (Branding & Account - Scrolls Away) */}
      <header className="relative z-40 w-full bg-white antialiased select-none">
        <Container>
          {/* Top Row: Logo & Action Icons */}
          <div className="flex items-center justify-between gap-4 py-3.5">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-3 shrink-0  invert-0">
              <Logo />
            </div>

            {/* Right: Actions & Account Control */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Regional Switchers */}
              <div className="hidden lg:flex items-center gap-1">
                {/* <LanguageSwitcher /> */}
                <CurrencySwitcher />
                <div className="h-8 w-px bg-gray-100 my-auto mx-2" />
              </div>

              {/* Personalization Navigation */}
              <div className="hidden md:flex items-center gap-1 sm:gap-2">
                <OrdersButton />
                <WishlistButton />
              </div>

              {/* Cart Trigger */}
              <CartButton />

              <div className="h-8 w-px bg-gray-100 my-auto mx-2 hidden md:block" />

              {/* User Identity Panel */}
              <div className="hidden md:flex items-center gap-1 sm:gap-2">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="group flex flex-col items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-[#002b15] active:scale-97"
                      aria-label="Account"
                    >
                      <UserIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-105 stroke-[2.2]" />
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        {dictionary.common.myAccount}
                      </span>
                    </Link>
                    <LogoutButton />
                  </>
                ) : (
                  <LoginModal>
                    <div className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-[#002b15] active:scale-97">
                      <UserIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-105 stroke-[2.2]" />
                      <span className="text-[9px] font-black uppercase tracking-wider">
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
                className="flex md:hidden items-center justify-center p-2 rounded-xl text-[#002b15] hover:bg-emerald-50/80 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="Open menu"
              >
                <Menu className="h-5.5 w-5.5 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* 2. Sticky Search Architecture (Becomes ultra-compact on scroll) */}
      <div
        className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out antialiased border-b
          ${isPinned 
            ? "bg-white/95 backdrop-blur-md shadow-md py-2 border-gray-100" 
            : "bg-white pb-4 pt-1 border-transparent"
          }`}
      >
        <Container>
          <div className="w-full flex justify-center transition-all duration-300 ease-in-out">
            <div
              className={`w-full transition-all duration-300 ease-in-out flex items-center
                ${isPinned ? "max-w-xl gap-3" : "max-w-2xl gap-0"}`}
            >
              {/* Mini Logo appearing only when pinned to maintain branding */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden shrink-0
                ${isPinned ? "w-8 opacity-100" : "w-0 opacity-0"}`}>
                <Link href="/" className="brightness-0 invert-0">
                   <Search className="h-6 w-6 text-[#002b15]"/>
                </Link>
              </div>

              <div className="flex-1">
                <SearchBar />
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Slide-Out Mobile Drawer Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end select-none antialiased">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Frame - Fully Branded Design */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 z-10 animate-in slide-in-from-right overflow-hidden border-l border-emerald-900/20">
            {/* Branded Drawer Header with Embedded <Logo /> */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-linear-to-r from-[#002b15] via-[#004220] to-[#005c2e] text-white shrink-0 shadow-md">
              <div className="brightness-0 invert scale-90 origin-left">
                <Logo />
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-full bg-white/10 text-white/90 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Main Category & Nav Items */}
            <div className="flex flex-col flex-1 overflow-y-auto divide-y divide-gray-100">
              {/* Regional Preferences Section (Top Placement) */}
              <div className="p-4 bg-emerald-50/50 border-b border-emerald-100/70 space-y-3">
                <span className="block text-[9px] font-black uppercase tracking-widest text-[#005c2e]">
                  Regional Preferences
                </span>

                <div className="space-y-2.5 px-0.5">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="flex items-center gap-2 font-bold text-[#002b15]">
                      <Globe className="h-4 w-4 text-[#005c2e] shrink-0" /> Language
                    </span>
                    {/* <div className="scale-90 origin-right select-auto">
                      <LanguageSwitcher />
                    </div> */}
                  </div>

                  <div className="flex items-center justify-between gap-4 text-xs pt-2 border-t border-emerald-100/80">
                    <span className="flex items-center gap-2 font-bold text-[#002b15]">
                      <DollarSign className="h-4 w-4 text-[#005c2e] shrink-0" /> Currency
                    </span>
                    <div className="scale-90 origin-right select-auto">
                      <CurrencySwitcher />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Hub */}
              <div className="p-5 space-y-3">
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Account Hub
                </span>

                {user ? (
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50/80 hover:text-[#002b15] transition-colors font-black text-xs uppercase tracking-wider group"
                    >
                      <UserIcon className="h-4 w-4 text-gray-400 group-hover:text-[#005c2e] transition-colors shrink-0 stroke-[2.2]" />
                      <span>{dictionary.common.myAccount}</span>
                    </Link>

                    <div className="px-3 py-1">
                      <LogoutButton />
                    </div>
                  </div>
                ) : (
                  <LoginModal>
                    <div className="group flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-neutral-600 transition-all duration-200 hover:bg-neutral-50 hover:text-[#004d26]">
                      <UserIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-105" />
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        {dictionary.common.login}
                      </span>
                    </div>
                  </LoginModal>
                )}
              </div>

              {/* Shop Actions */}
              <div className="p-5 space-y-3">
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Shop Actions
                </span>

                <div className="space-y-1">
                  <Link
                    href="/account/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50/80 hover:text-[#002b15] transition-colors font-black text-xs uppercase tracking-wider group"
                  >
                    <ShoppingBag className="h-4 w-4 text-gray-400 group-hover:text-[#005c2e] transition-colors shrink-0 stroke-[2.2]" />
                    <span>Track Orders</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl text-gray-700 hover:bg-emerald-50/80 hover:text-[#002b15] transition-colors font-black text-xs uppercase tracking-wider group"
                  >
                    <Heart className="h-4 w-4 text-gray-400 group-hover:text-[#005c2e] transition-colors shrink-0 stroke-[2.2]" />
                    <span>My Wishlist</span>
                  </Link>
                </div>
              </div>

              {/* Brand Footer Stamp */}
              <div className="p-5 mt-auto bg-linear-to-b from-gray-50/50 to-emerald-50/30">
                <div className="flex items-center gap-2 text-[#005c2e]">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
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