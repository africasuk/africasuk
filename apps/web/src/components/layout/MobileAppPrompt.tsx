
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Smartphone } from "lucide-react";

const excludedPaths = [
  "/request-product",
  "/about",
  "/business-information",
  "/careers",
  "/terms",
  "/privacy",
  "/help",
  "/shipping",
  "/payment-information",
  "/returns",
  "/contact",
  "/track",
  "/auth",
  "/account/delete",
  "/profile",
];

const DISMISS_KEY = "africasuk-app-prompt-dismissed";

const APP_STORE_URL =
  "https://apps.apple.com/in/app/africa-suk/id6830582715";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.africasuk.app";

type Platform = "ios" | "android";

function detectPlatform(): Platform | null {
  if (typeof navigator === "undefined") return null;

  const ua = navigator.userAgent;

  if (/iPhone|iPod/i.test(ua)) return "ios";
  if (/Android.*Mobile/i.test(ua)) return "android";

  return null;
}

export default function MobileAppPrompt() {
  const pathname = usePathname();

  const [platform] = useState<Platform | null>(detectPlatform);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const excluded = excludedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  useEffect(() => {
    if (!platform || excluded) return;

    const timer = window.setTimeout(() => {
      setReady(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [platform, excluded, pathname]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const closePrompt = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const openApp = () => {
    if (!platform) return;

    const currentPath = window.location.pathname.replace(/^\/+/, "");
    const deepLink = `africasuk://${currentPath}${window.location.search}`;

    const storeUrl =
      platform === "ios" ? APP_STORE_URL : PLAY_STORE_URL;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(fallbackTimer);
      }
    };

    const fallbackTimer = window.setTimeout(() => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      if (!document.hidden) {
        window.location.href = storeUrl;
      }
    }, 1800);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.location.href = deepLink;
    closePrompt();
  };

  if (!ready || dismissed || !platform || excluded) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/55 px-5 backdrop-blur-sm"
      onClick={closePrompt}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-prompt-title"
        className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closePrompt}
          aria-label="Close popup"
          className="absolute right-4 top-4 rounded-full p-2 text-zinc-400 hover:bg-zinc-100"
        >
          <X size={19} />
        </button>

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#005c2e]">
          <Smartphone size={32} />
        </div>

        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#16833B]">
          Africa Suk
        </p>

        <h2 id="app-prompt-title" className="text-2xl font-extrabold text-zinc-900">
          Shop with Confidence
        </h2>

        <p className="mt-3 text-sm leading-6 text-zinc-500">
          Enjoy a better shopping experience with the Africa Suk mobile app.
        </p>

        <button
          type="button"
          onClick={openApp}
          className="mt-6 w-full rounded-xl bg-[#005c2e] px-5 py-3.5 text-sm font-bold text-white hover:bg-[#004522]"
        >
          Open in Africa Suk App
        </button>

        <button
          type="button"
          onClick={closePrompt}
          className="mt-3 w-full rounded-xl border border-zinc-200 px-5 py-3.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          Continue with Website
        </button>

        <p className="mt-4 text-xs text-zinc-400">
          You can continue shopping on the website anytime.
        </p>
      </div>
    </div>
  );
}
