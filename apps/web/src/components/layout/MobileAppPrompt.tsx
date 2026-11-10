
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Smartphone, ArrowUpRight } from "lucide-react";

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
    (path) =>
      pathname === path || pathname.startsWith(`${path}/`)
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
      setDismissed(
        localStorage.getItem(DISMISS_KEY) === "1"
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const closePrompt = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const openApp = () => {
    if (!platform) return;

    const currentUrl = window.location.href;
    const storeUrl =
      platform === "ios" ? APP_STORE_URL : PLAY_STORE_URL;

    const fallbackTimer = window.setTimeout(() => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      if (!document.hidden) {
        window.location.href = storeUrl;
      }
    }, 1800);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.clearTimeout(fallbackTimer);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    window.location.href = currentUrl;
    closePrompt();
  };

  if (!ready || dismissed || !platform || excluded) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/35 px-5 backdrop-blur-[3px]"
      onClick={closePrompt}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-prompt-title"
        className="relative w-full max-w-77.5 overflow-hidden rounded-[26px] border border-white/60 bg-white/75 p-5 text-center shadow-[0_20px_70px_rgba(0,0,0,0.18)] backdrop-blur-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/15 blur-3xl" />

        <button
          type="button"
          onClick={closePrompt}
          aria-label="Close popup"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/60 text-zinc-500 transition hover:bg-white"
        >
          <X size={16} />
        </button>

        <div className="relative mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50/80 text-[#005c2e] shadow-sm">
          <Smartphone size={23} strokeWidth={1.8} />
        </div>

        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#16833B]">
          Africa Suk
        </p>

        <h2
          id="app-prompt-title"
          className="text-lg font-extrabold tracking-tight text-zinc-900"
        >
          Shop with Confidence
        </h2>

        <p className="mx-auto mt-2 max-w-61.25 text-xs leading-5 text-zinc-600">
          Enjoy a smoother shopping experience with our mobile app.
        </p>

        <button
          type="button"
          onClick={openApp}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700/20 bg-[#005c2e] px-4 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#004522] active:scale-[0.98]"
        >
          Open in Africa Suk App
          <ArrowUpRight size={15} />
        </button>

        <button
          type="button"
          onClick={closePrompt}
          className="mt-2.5 w-full rounded-xl border border-white/80 bg-white/55 px-4 py-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-white/90"
        >
          Continue with Website
        </button>
      </div>
    </div>
  );
}
