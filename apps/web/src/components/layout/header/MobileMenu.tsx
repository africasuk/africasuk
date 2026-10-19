
"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  X,
  ShoppingBag,
  Heart,
  Globe,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { getDictionary } from "@africasuk/i18n";

import Logo from "./Logo";
import { CurrencySwitcher } from "@/components/currency/CurrencySwitcher";
import LogoutButton from "../topbar/LogoutButton";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  dictionary: Dictionary;
}

export default function MobileMenu({
  open,
  onClose,
  user,
  dictionary,
}: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex justify-end antialiased lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
      />

      <aside
        aria-label="Navigation menu"
        className="relative z-10 flex h-full w-80 max-w-[88vw] animate-in slide-in-from-right flex-col overflow-hidden border-l border-gray-200 bg-white shadow-xl"
      >
        <div className="flex shrink-0 items-center justify-between bg-[#004d26] px-4 py-3 text-white">
          <Logo iconOnly />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 text-white/90 transition hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col divide-y divide-gray-100 overflow-y-auto">
          <section className="space-y-3 border-b border-gray-100 bg-gray-50/70 p-4">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              Regional preferences
            </span>

            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-2 text-gray-700">
                <Globe className="h-4 w-4 text-gray-500" />
                Language
              </span>
              <span className="text-gray-400">Default</span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-gray-200/70 pt-3 text-xs">
              <span className="flex items-center gap-2 text-gray-700">
                <DollarSign className="h-4 w-4 text-gray-500" />
                Currency
              </span>
              <CurrencySwitcher />
            </div>
          </section>

          <section className="space-y-2 p-4">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Account
            </span>

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#004d26]"
                >
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  {dictionary.common.myAccount}
                </Link>

                <div className="px-3 py-1">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={onClose}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#004d26]"
              >
                <UserIcon className="h-4 w-4 text-gray-400" />
                {dictionary.common.login}
              </Link>
            )}
          </section>

          <section className="space-y-2 p-4">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Shopping
            </span>

            <Link
              href="/account/orders"
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#004d26]"
            >
              <ShoppingBag className="h-4 w-4 text-gray-400" />
              Track orders
            </Link>

            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#004d26]"
            >
              <Heart className="h-4 w-4 text-gray-400" />
              My wishlist
            </Link>
          </section>

          <div className="mt-auto border-t border-gray-100 bg-gray-50/50 p-4">
            <div className="flex items-center gap-2 text-[#004d26]">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                Africa Suk verified commerce
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
