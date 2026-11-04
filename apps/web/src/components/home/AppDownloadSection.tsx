
"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const emptySubscribe = () => () => {};

const getTimeLeft = (): TimeLeft => {
  const targetDate = new Date("2027-04-01T00:00:00").getTime();
  const difference = Math.max(0, targetDate - Date.now());

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

export default function AppDownloadSection() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#002d21] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-linear-to-br from-[#001f17] via-[#003d2b] to-[#005c3b]" />

      <div className="pointer-events-none absolute left-[-18%] top-[20%] -z-10 h-150 w-150 rounded-full bg-[#006b48]/25 blur-[140px]" />

      <div className="pointer-events-none absolute right-[-15%] top-[-20%] -z-10 h-150 w-150 rounded-full bg-[#008f5c]/20 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-30%] left-[35%] -z-10 h-125 w-125 rounded-full bg-[#d4a017]/6 blur-[130px]" />

      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="pointer-events-none absolute left-[30%] top-0 -z-10 h-px w-[40%] bg-linear-to-r from-transparent via-emerald-200/20 to-transparent" />

      {/* Main Content */}
      <div className="relative mx-auto flex min-h-[calc(100vh-42px)] w-full max-w-[1600px] items-center px-5 py-10 sm:px-10 sm:py-16 lg:px-16 xl:px-20">
        <div className="grid w-full items-center gap-7 sm:gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 xl:gap-20">
          {/* Phone Image */}
          <div className="relative flex justify-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-[100px]" />

            <Image
              src="/phone.png"
              alt="Africa Suk mobile shopping application"
              width={700}
              height={1000}
              priority
              draggable={false}
              className="pointer-events-none relative z-10 h-auto w-full max-w-80 select-none object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.45)] sm:max-w-96 lg:max-w-md xl:max-w-125"
            />
          </div>

          {/* Content */}
          <div className="mx-auto w-full max-w-3xl lg:mx-0">
            <h2 className="mt-2 max-w-2xl text-3xl font-black leading-[0.96] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl xl:text-8xl">
              Africa Suk
              <br />
              <span className="bg-linear-to-r from-emerald-200 via-emerald-300 to-[#8df0bb] bg-clip-text text-transparent">
                in your pocket.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-xs leading-6 text-emerald-50 sm:mt-7 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              Shop products, discover new deals and manage your orders
              wherever you are. Everything Africa Suk, right from your phone.
            </p>

            {/* Download Buttons - Side by Side */}
            <div className="mt-6 grid w-full max-w-xl grid-cols-2 gap-2 sm:mt-9 sm:gap-3">
              {/* Google Play */}
              <Link
                href="https://play.google.com/store/apps/details?id=com.africasuk.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-12 min-w-0 items-center justify-between rounded-xl bg-white px-3 text-zinc-950 shadow-xl shadow-black/15 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 sm:h-16 sm:rounded-2xl sm:px-5"
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-3.5">
                  <svg
                    className="h-6 w-6 shrink-0 sm:h-7 sm:w-7"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M3.6 1.8l10.8 10.2L3.6 22.2c-.4-.3-.6-.8-.6-1.4V3.2c0-.6.2-1.1.6-1.4z"
                    />
                    <path
                      fill="#34A853"
                      d="M14.4 12L17.7 8.7 4.8 1.4c-.4-.2-.8-.2-1.2 0L14.4 12z"
                    />
                    <path
                      fill="#FBBC04"
                      d="M20.5 10.4l-2.8-1.7-3.3 3.3 3.3 3.3 2.8-1.7c.9-.5.9-1.4 0-1.9z"
                    />
                    <path
                      fill="#EA4335"
                      d="M14.4 12L3.6 22.2c.4.2.8.2 1.2 0l12.9-7.3-3.3-2.9z"
                    />
                  </svg>

                  <div className="min-w-0 text-left">
                    <span className="block text-[7px] font-medium uppercase tracking-wider text-zinc-400 sm:text-[9px]">
                      Get it on
                    </span>
                    <span className="block truncate text-[11px] font-bold leading-tight sm:text-sm">
                      Google Play
                    </span>
                  </div>
                </div>

                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-900 sm:h-4 sm:w-4" />
              </Link>

              {/* App Store */}
              <div
                title="iOS release scheduled for April 2027"
                className="flex h-12 min-w-0 cursor-not-allowed items-center justify-between rounded-xl border border-white/15 bg-white/5 px-3 text-white/45 backdrop-blur-sm sm:h-16 sm:rounded-2xl sm:px-4"
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <svg
                    className="h-5 w-5 shrink-0 fill-white/35 sm:h-6 sm:w-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.16.65-2.79 1.4-.56.64-1.04 1.74-.91 2.8 1.11.09 2.19-.55 2.76-1.27z" />
                  </svg>

                  <div className="min-w-0 text-left">
                    <span className="block text-[7px] font-medium uppercase tracking-wider text-white/35 sm:text-[9px]">
                      Download on
                    </span>
                    <span className="block truncate text-[11px] font-bold leading-tight text-white/55 sm:text-sm">
                      App Store
                    </span>
                  </div>
                </div>

                <div className="ml-1 shrink-0 text-right">
                  <span className="block text-[7px] font-bold uppercase tracking-wider text-emerald-300/70 sm:text-[8px]">
                    Coming April
                  </span>
                  <span className="block font-mono text-[7px] text-white/40 sm:text-[9px]">
                    {isClient
                      ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`
                      : "--d --h --m"}
                  </span>
                </div>
              </div>
            </div>

            {/* Web App */}
            <Link
              href="https://app.africasuk.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-200 transition-colors hover:text-white sm:mt-5 sm:text-xs"
            >
              Or shop from the web app
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
