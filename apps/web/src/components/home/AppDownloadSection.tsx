"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const emptySubscribe = () => () => {};

const getTimeLeft = (): TimeLeft => {
  const targetDate = new Date(
    "2027-04-01T00:00:00",
  ).getTime();

  const difference = Math.max(
    0,
    targetDate - Date.now(),
  );

  return {
    days: Math.floor(
      difference / (1000 * 60 * 60 * 24),
    ),
    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24,
    ),
    minutes: Math.floor(
      (difference / (1000 * 60)) % 60,
    ),
    seconds: Math.floor(
      (difference / 1000) % 60,
    ),
  };
};

export default function AppDownloadSection() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [timeLeft, setTimeLeft] =
    useState<TimeLeft>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-[#002d21] text-white">
      {/* Main dark Africa Suk gradient */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-linear-to-br from-[#001f17] via-[#003d2b] to-[#005c3b]" />

      {/* Deep brand glow */}
      <div className="pointer-events-none absolute -left-[18%] top-[20%] -z-10 h-150 w-150 rounded-full bg-[#006b48]/25 blur-[140px]" />

      <div className="pointer-events-none absolute -right-[15%] top-[-20%] -z-10 h-150 w-150 rounded-full bg-[#008f5c]/20 blur-[140px]" />

      <div className="pointer-events-none absolute bottom-[-30%] left-[35%] -z-10 h-125 w-125 rounded-full bg-[#d4a017]/6 blur-[130px]" />

      {/* Very subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Decorative light */}
      <div className="pointer-events-none absolute left-[30%] top-0 -z-10 h-px w-[40%] bg-linear-to-r from-transparent via-emerald-200/20 to-transparent" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[calc(100vh-42px)] w-full max-w-[1600px] items-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-20 xl:grid-cols-[500px_minmax(0,1fr)] xl:gap-24">

          {/* =========================================================
              PHONE
          ========================================================== */}
          <div className="relative flex justify-center lg:justify-center">
            {/* Phone ambient glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-105 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/10 blur-[100px]" />

            <div className="relative">

              {/* Phone shadow underneath */}
              <div className="pointer-events-none absolute -bottom-8 left-1/2 h-14 w-[70%] -translate-x-1/2 rounded-full bg-black/50 blur-2xl" />

              {/* =====================================================
                  REALISTIC PHONE OUTER FRAME
              ====================================================== */}
              <div
                className="
                  relative
                  h-125
                  w-62.5
                  rounded-[42px]
                  border-[8px]
                  border-[#101514]
                  bg-[#101514]
                  shadow-[0_35px_90px_rgba(0,0,0,0.48)]
                  ring-1
                  ring-white/10
                  sm:h-135
                  sm:w-67.5
                  xl:h-147.5
                  xl:w-73.75
                "
              >
                {/* Metallic outer highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-[34px] ring-1 ring-white/15" />

                {/* Inner frame */}
                <div className="pointer-events-none absolute inset-[2px] rounded-[35px] border border-white/5" />

                {/* Left volume buttons */}
                <div className="absolute -left-[11px] top-28 h-12 w-[3px] rounded-l-full bg-[#2d3532] shadow-[inset_-1px_0_1px_rgba(255,255,255,0.2)]" />

                <div className="absolute -left-[11px] top-44 h-16 w-[3px] rounded-l-full bg-[#2d3532] shadow-[inset_-1px_0_1px_rgba(255,255,255,0.2)]" />

                {/* Right power button */}
                <div className="absolute -right-[11px] top-36 h-20 w-[3px] rounded-r-full bg-[#2d3532] shadow-[inset_1px_0_1px_rgba(255,255,255,0.2)]" />

                {/* =================================================
                    SCREEN
                ================================================== */}
                <div className="relative h-full w-full overflow-hidden rounded-[34px] bg-[#f7faf8]">

                  {/* Screen reflection */}
                  <div className="pointer-events-none absolute inset-0 z-40 bg-linear-to-br from-white/10 via-transparent to-transparent" />

                  {/* Dynamic Island */}
                  <div className="absolute left-1/2 top-2 z-50 h-7 w-24 -translate-x-1/2 rounded-full bg-black shadow-inner" />

                  {/* Tiny camera highlight */}
                  <div className="absolute left-1/2 top-[14px] z-50 ml-7 h-1.5 w-1.5 rounded-full bg-[#17201d]" />

                  {/* App Header */}
                  <div className="px-5 pb-3 pt-12">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-zinc-400">
                          Welcome back
                        </p>

                        <p className="text-sm font-bold text-zinc-900">
                          Africa Suk
                        </p>
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#005c2e] text-white shadow-sm">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Main app card */}
                  <div className="mx-4 overflow-hidden rounded-2xl bg-linear-to-br from-[#005c2e] to-[#00864b] p-4 shadow-lg shadow-[#005c2e]/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                        <Image
                          src="/homelogo.png"
                          alt="Africa Suk"
                          width={34}
                          height={34}
                          className="object-contain"
                        />
                      </div>

                      <div>
                        <p className="text-[8px] text-white/70">
                          Shop with confidence
                        </p>

                        <p className="text-xs font-bold text-white">
                          Everything you need
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Explore */}
                  <div className="px-4 pt-6">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-xs font-bold text-zinc-900">
                        Explore
                      </p>

                      <p className="text-[9px] font-medium text-[#005c2e]">
                        View all
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-zinc-100 bg-white p-2 shadow-sm">
                        <div className="h-20 rounded-xl bg-zinc-100" />

                        <div className="mt-2 h-2 w-16 rounded-full bg-zinc-200" />

                        <div className="mt-2 h-2 w-10 rounded-full bg-emerald-100" />
                      </div>

                      <div className="rounded-2xl border border-zinc-100 bg-white p-2 shadow-sm">
                        <div className="h-20 rounded-xl bg-emerald-50" />

                        <div className="mt-2 h-2 w-16 rounded-full bg-zinc-200" />

                        <div className="mt-2 h-2 w-10 rounded-full bg-emerald-100" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom navigation */}
                  <div className="absolute bottom-0 left-0 right-0 flex h-14 items-center justify-around border-t border-zinc-100 bg-white">
                    <div className="h-1.5 w-6 rounded-full bg-[#005c2e]" />
                    <div className="h-1.5 w-6 rounded-full bg-zinc-200" />
                    <div className="h-1.5 w-6 rounded-full bg-zinc-200" />
                  </div>
                </div>
              </div>

              {/* =================================================
                  FLOATING TRUST BADGE
              ================================================== */}
              <div className="absolute -right-12 top-24 hidden rounded-2xl border border-white/20 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-md sm:block">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                    <ShieldCheck className="h-4 w-4 text-[#005c2e]" />
                  </div>

                  <div>
                    <p className="text-[9px] font-medium text-zinc-400">
                      Shop with confidence
                    </p>

                    <p className="text-[11px] font-bold text-zinc-900">
                      Secure shopping
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  FLOATING SHOPPING BADGE
              ================================================== */}
              <div className="absolute -left-12 bottom-28 hidden items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2.5 text-zinc-900 shadow-2xl sm:flex">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d4a017]/15">
                  <Check className="h-3.5 w-3.5 text-[#a87c00]" />
                </span>

                <span className="text-[10px] font-bold">
                  Easy shopping
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT CONTENT
          ========================================================== */}
          <div className="max-w-3xl lg:pl-0">



            {/* Heading */}
            <h2 className="mt-6 max-w-2xl text-4xl font-black leading-[0.96] tracking-[-0.045em] text-white sm:text-5xl lg:text-7xl xl:text-8xl">
              Africa Suk
              <br />

              <span className="bg-linear-to-r from-emerald-200 via-emerald-300 to-[#8df0bb] bg-clip-text text-transparent">
                in your pocket.
              </span>
            </h2>

            {/* Description */}
            <p className="mt-7 max-w-2xl text-sm leading-7 text-emerald-50 sm:text-base lg:text-lg lg:leading-8">
              Shop products, discover new deals and manage your
              orders wherever you are. Everything Africa Suk,
              right from your phone.
            </p>

            {/* Feature pills */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                "Easy shopping",
                "Secure orders",
                "Track orders",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-[11px] font-semibold text-emerald-50/80 backdrop-blur-sm"
                >
                  {item}
                </div>
              ))}
            </div>

            {/* =====================================================
                DOWNLOAD BUTTONS
            ====================================================== */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              {/* Google Play */}
              <Link
                href="https://play.google.com/store/apps/details?id=com.africasuk.app"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  flex
                  h-16
                  items-center
                  justify-between
                  rounded-2xl
                  bg-white
                  px-5
                  text-zinc-950
                  shadow-xl
                  shadow-black/15
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-2xl
                  active:translate-y-0
                  sm:w-60
                "
              >
                <div className="flex items-center gap-3.5">
                  <svg
                    className="h-7 w-7 shrink-0"
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

                  <div className="text-left">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                      Get it on
                    </span>

                    <span className="block text-sm font-bold leading-tight">
                      Google Play
                    </span>
                  </div>
                </div>

                <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-900" />
              </Link>

              {/* App Store */}
              <div
                title="iOS release scheduled for April 2027"
                className="
                  flex
                  h-16
                  cursor-not-allowed
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-white/15
                  bg-white/5
                  px-5
                  text-white/45
                  backdrop-blur-sm
                  sm:w-60
                "
              >
                <div className="flex items-center gap-3.5">
                  <svg
                    className="h-6 w-6 shrink-0 fill-white/35"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.16.65-2.79 1.4-.56.64-1.04 1.74-.91 2.8 1.11.09 2.19-.55 2.76-1.27z" />
                  </svg>

                  <div className="text-left">
                    <span className="block text-[9px] font-medium uppercase tracking-wider text-white/35">
                      Download on
                    </span>

                    <span className="block text-sm font-bold leading-tight text-white/55">
                      App Store
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-emerald-300/70">
                    Coming April
                  </span>

                  <span className="block font-mono text-[9px] text-white/40">
                    {isClient
                      ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m`
                      : "--d --h --m"}
                  </span>
                </div>
              </div>
            </div>

            {/* Web app */}
            <Link
              href="https://app.africasuk.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-5 inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 transition-colors hover:text-white"
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