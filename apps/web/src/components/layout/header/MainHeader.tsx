"use client";

import { useState } from "react";
import Link from "next/link";
import { User as UserIcon, Menu, X, ShoppingBag, Heart, Globe, DollarSign } from "lucide-react"; 
import type { User } from "@supabase/supabase-js";
import type { getDictionary } from "@africasuk/i18n";

import Container from "../Container";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import OrdersButton from "./OrdersButton";
import WishlistButton from "./WishlistButton";
import CartButton from "./CartButton";
import LoginModal from "@/components/auth/LoginModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { CurrencySwitcher } from "@/components/currency/CurrencySwitcher";
import LogoutButton from "../topbar/LogoutButton";

type Dictionary = ReturnType<typeof getDictionary>;

interface MainHeaderProps {
  user: User | null;
  dictionary: Dictionary;
}

export default function MainHeader({ user, dictionary }: MainHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Header Wrapper */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md antialiased select-none shadow-xs">
        <Container>
          <div className="flex flex-col py-3 space-y-3">
            
            {/* Top Row: Logo & Action Icons */}
            <div className="flex items-center justify-between gap-4">
              
              {/* Left: Brand Logo */}
              <div className="flex items-center gap-3 shrink-0">
                <Logo />
              </div>

              {/* Right: Actions & Account Control */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                
                {/* Regional Switchers */}
                <div className="hidden md:flex items-center gap-1">
                  <LanguageSwitcher />
                  <CurrencySwitcher />
                  <div className="h-8 w-px bg-gray-200 my-auto mx-2" />
                </div>

                {/* Personalization Navigation */}
                <div className="hidden md:flex items-center gap-1 sm:gap-2">
                  <OrdersButton />
                  <WishlistButton />
                </div>

                {/* Cart Trigger */}
                <CartButton />

                <div className="h-8 w-px bg-gray-200 my-auto mx-2 hidden md:block" />

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
                      <button className="group flex flex-col items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-[#002b15] active:scale-97 cursor-pointer border-none bg-transparent p-0">
                        <UserIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-105 stroke-[2.2]" />
                        <span className="text-[9px] font-black uppercase tracking-wider">
                          {dictionary.common.login}
                        </span>
                      </button>
                    </LoginModal>
                  )}
                </div>

                {/* Mobile Navigation Trigger */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="flex md:hidden items-center justify-center p-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-[#002b15] active:scale-95 transition-all duration-200 cursor-pointer"
                  aria-label="Open menu"
                >
                  <Menu className="h-5.5 w-5.5 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Bottom Row: Centered Search Architecture */}
            <div className="w-full pt-1 flex justify-center">
              <div className="w-full max-w-2xl">
                <SearchBar />
              </div>
            </div>

          </div>
        </Container>
      </header>

      {/* Slide-Out Mobile Drawer Sheet */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end select-none antialiased">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Frame */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 z-10 animate-in slide-in-from-right">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4.5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black tracking-widest text-[#002b15] uppercase">
                  AfricasUK
                </span>
                <div className="h-2 w-px bg-gray-300" />
                <span className="text-[9px] font-black tracking-widest text-gray-900 uppercase">
                  Navigation
                </span>
              </div>
              <button 
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-950 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Main Category & Nav Items */}
            <div className="flex flex-col flex-1 overflow-y-auto divide-y divide-gray-100">
              
              {/* Account Management */}
              <div className="p-5 space-y-3">
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Account Hub
                </span>
                
                {user ? (
                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#002b15] transition-colors font-black text-xs uppercase tracking-wider group"
                    >
                      <UserIcon className="h-4 w-4 text-gray-400 group-hover:text-[#002b15] transition-colors shrink-0 stroke-[2.2]" />
                      <span>{dictionary.common.myAccount}</span>
                    </Link>
                    
                    <div className="px-3 py-1">
                      <LogoutButton />
                    </div>
                  </div>
                ) : (
                  <LoginModal>
                    <button className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#002b15] text-left font-black text-xs uppercase tracking-wider cursor-pointer border-none bg-transparent group">
                      <UserIcon className="h-4 w-4 text-gray-400 group-hover:text-[#002b15] transition-colors shrink-0 stroke-[2.2]" />
                      <span>{dictionary.common.login}</span>
                    </button>
                  </LoginModal>
                )}
              </div>

              {/* Commerce Utilities */}
              <div className="p-5 space-y-3">
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Shop Actions
                </span>
                
                <div className="space-y-1">
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#002b15] transition-colors font-black text-xs uppercase tracking-wider group"
                  >
                    <ShoppingBag className="h-4 w-4 text-gray-400 group-hover:text-[#002b15] transition-colors shrink-0 stroke-[2.2]" />
                    <span>Track Orders</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#002b15] transition-colors font-black text-xs uppercase tracking-wider group"
                  >
                    <Heart className="h-4 w-4 text-gray-400 group-hover:text-[#002b15] transition-colors shrink-0 stroke-[2.2]" />
                    <span>My Wishlist</span>
                  </Link>
                </div>
              </div>

              {/* System Preferences */}
              <div className="p-5 mt-auto space-y-4 bg-gray-50/50">
                <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
                  Regional Preferences
                </span>
                
                <div className="space-y-3 px-1">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="flex items-center gap-2.5 font-bold text-gray-600">
                      <Globe className="h-4 w-4 text-gray-400 shrink-0" /> Language
                    </span>
                    <div className="scale-90 origin-right select-auto">
                      <LanguageSwitcher />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 text-xs pt-1.5 border-t border-gray-200/50">
                    <span className="flex items-center gap-2.5 font-bold text-gray-600">
                      <DollarSign className="h-4 w-4 text-gray-400 shrink-0" /> Currency
                    </span>
                    <div className="scale-90 origin-right select-auto">
                      <CurrencySwitcher />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}