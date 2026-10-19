"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Package,
  Heart,
  HelpCircle,
  ShieldCheck,
  FileText,
  Info,
  Star,
  Share2,
  ChevronRight,
  Globe,
  ArrowLeft,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/auth/client";
import { CurrencySwitcher } from "@/components/currency/CurrencySwitcher";
import Logo from "@/components/layout/header/Logo";
import LogoutButton from "@/components/layout/topbar/LogoutButton";

const APP_VERSION = "1.0.0";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.africasuk.app";

interface MenuRowProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

function MenuRow({
  icon: Icon,
  label,
  href,
  onClick,
  danger = false,
}: MenuRowProps) {
  const className = `flex min-h-14 w-full items-center gap-3 px-4 text-left transition-colors hover:bg-gray-50 ${
    danger ? "text-red-600" : "text-gray-800"
  }`;

  const content = (
    <>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          danger ? "bg-red-50" : "bg-gray-100"
        }`}
      >
        <Icon
          className={`h-4.5 w-4.5 ${
            danger ? "text-red-600" : "text-gray-700"
          }`}
        />
      </span>

      <span className="flex-1 text-sm font-medium">{label}</span>

      <ChevronRight className="h-4 w-4 text-gray-400" />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export default function MenuPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const loadUser = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (mounted) setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    };

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: "Africa Suk",
      text: "Shop with Confidence on Africa Suk.",
      url: "https://app.africasuk.com",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`
        );
        alert("Africa Suk link copied!");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Failed to share:", error);
      }
    }
  };

  const openPlayStore = () => {
    window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-10 antialiased">
      <header className="border-b border-gray-100 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight text-gray-950">
              Account & Settings
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">
              Manage your account and preferences
            </p>
          </div>

          <Logo iconOnly />
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 px-4 pt-6">
        {/* Account */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Account
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {authLoading ? (
              <div className="px-4 py-5 text-sm text-gray-500">
                Checking account status...
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
                    <UserIcon className="h-5 w-5 text-[#005c2e]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      My Account
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <MenuRow
                  icon={UserIcon}
                  label="My Profile"
                  href="/profile"
                />
                <div className="border-t border-gray-100">
                  <MenuRow
                    icon={Package}
                    label="My Orders"
                    href="/account/orders"
                  />
                </div>
                <div className="border-t border-gray-100">
                  <MenuRow
                    icon={Heart}
                    label="My Wishlist"
                    href="/wishlist"
                  />
                </div>
                <div className="border-t border-gray-100 px-4 py-3">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-4">
                  <p className="text-sm font-semibold text-gray-900">
                    Welcome to Africa Suk
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Sign in to manage your orders, profile, and saved items.
                  </p>
                  <Link
                    href="/auth/login"
                    className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-[#005c2e] px-5 text-sm font-semibold text-white hover:bg-[#004620]"
                  >
                    Sign In
                  </Link>
                </div>
                <div className="border-t border-gray-100">
                  <MenuRow
                    icon={Package}
                    label="Track Orders"
                    href="/account/orders"
                  />
                </div>
                <div className="border-t border-gray-100">
                  <MenuRow
                    icon={Heart}
                    label="My Wishlist"
                    href="/wishlist"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Preferences
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="flex min-h-14 items-center gap-3 px-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                <Globe className="h-4.5 w-4.5 text-gray-700" />
              </span>
              <span className="flex-1 text-sm font-medium text-gray-800">
                Language
              </span>
              <span className="text-xs text-gray-400">Default</span>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
              <span className="text-sm font-medium text-gray-800">
                Currency
              </span>
              <CurrencySwitcher />
            </div>
          </div>
        </section>

        {/* Support and legal */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Support & Legal
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <MenuRow
              icon={HelpCircle}
              label="Help Center"
              href="/help"
            />
            <div className="border-t border-gray-100">
              <MenuRow
                icon={ShieldCheck}
                label="Privacy Policy"
                href="/privacy"
              />
            </div>
            <div className="border-t border-gray-100">
              <MenuRow
                icon={FileText}
                label="Terms & Conditions"
                href="/terms"
              />
            </div>
            <div className="border-t border-gray-100">
              <MenuRow
                icon={Info}
                label="About Africa Suk"
                href="/about"
              />
            </div>
            <div className="border-t border-gray-100">
              <MenuRow
                icon={Heart}
                label="Request a Product"
                href="/request-product"
              />
            </div>
          </div>
        </section>

        {/* Application */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
            Application
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <MenuRow
              icon={Star}
              label="Rate Africa Suk"
              onClick={openPlayStore}
            />
            <div className="border-t border-gray-100">
              <MenuRow
                icon={Share2}
                label="Share Africa Suk"
                onClick={handleShare}
              />
            </div>
          </div>
        </section>

        {/* Trust */}
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-green-100 bg-green-50 px-4 py-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#005c2e]" />
          <span className="text-xs font-semibold text-[#005c2e]">
            Africa Suk — Shop with Confidence
          </span>
        </div>

        <footer className="pb-4 text-center">
          <p className="text-xs font-medium text-gray-500">
            Africa Suk · v{APP_VERSION}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            © {new Date().getFullYear()} Africa Suk. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}