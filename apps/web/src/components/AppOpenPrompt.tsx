"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Smartphone, X } from "lucide-react";

export default function AppOpenPrompt() {
  const [show, setShow] = useState(() => {
    if (typeof navigator === "undefined") return false;
    return navigator.userAgent.toLowerCase().includes("android");
  });

  const openApp = () => {
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.africasuk.app";

    let appOpened = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        appOpened = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.location.href = "africasuk://";

    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (!appOpened && !document.hidden) {
        window.location.href = playStoreUrl;
      }
    }, 1800);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-end justify-center bg-black/50 p-4 backdrop-blur-[2px] sm:items-center">
      <div className="relative w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
        {/* Dismiss Icon */}
        <button
          onClick={() => setShow(false)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100/80 p-2.5">
            <Image
              src="/logo.png"
              alt="AfricaSuk"
              width={28}
              height={28}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="mb-1 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            <Smartphone className="h-3 w-3" strokeWidth={2} />
            Mobile App
          </div>

          <h2 className="mt-2 text-lg font-bold tracking-tight text-zinc-900">
            Open in AfricaSuk App?
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            Enjoy faster checkout, instant order tracking, and custom sourcing
            requests directly in our app.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={openApp}
            className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-xs font-semibold text-white transition active:scale-[0.985] hover:bg-zinc-800"
          >
            <span>Open AfricaSuk App</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </button>

          <button
            onClick={() => setShow(false)}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 transition active:scale-[0.985] hover:bg-zinc-50"
          >
            Continue in Browser
          </button>
        </div>
      </div>
    </div>
  );
}