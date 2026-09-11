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

export default function AppDownloadSection() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target: April 1, 2027
    const targetDate = new Date("2027-04-01T00:00:00").getTime();

    const calculateRemaining = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const interval = setInterval(() => {
      setTimeLeft(calculateRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden  py-14 select-none antialiased sm:py-20">
      {/* Subtle Background Radial Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-80 w-120 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        {/* App Squircle Icon */}
        <div className="inline-flex flex-col items-center gap-2.5">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[18px] border border-zinc-200/80 bg-zinc-50 p-2.5 shadow-sm ring-1 ring-zinc-900/5 transition-transform duration-300 hover:scale-105">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[18px] bg-linear-to-b from-white/80 to-transparent" />
            <Image
              src="/homelogo.png"
              alt="AfricaSuk App Icon"
              width={48}
              height={48}
              className="relative z-10 object-contain drop-shadow-xs"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 text-[11px] font-semibold text-zinc-950 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>AfricaSuk Mobile</span>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Download AfricaSuk App
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-zinc-500 sm:text-sm">
          Fast, regional shopping and live corridor tracking right in your pocket.
        </p>

        {/* Action Buttons Row */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
          
          {/* Google Play (Active CTA) */}
          <Link
            href="https://play.google.com/store/apps/details?id=com.africasuk.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-14 w-full max-w-xs items-center justify-between rounded-2xl border border-zinc-900 bg-zinc-900 px-5 text-white shadow-sm transition-all active:scale-[0.985] hover:bg-zinc-800 sm:w-72"
          >
            <div className="flex items-center gap-3.5">
              <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24">
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
                <span className="block text-sm font-bold tracking-tight text-white leading-tight">
                  Google Play
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
            </div>
          </Link>

          {/* Apple App Store (Disabled State with Countdown) */}
          <div
            className="flex h-14 w-full max-w-xs cursor-not-allowed items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50/80 px-5 text-zinc-400 select-none sm:w-72"
            title="iOS release scheduled for April 2027"
          >
            <div className="flex items-center gap-3.5">
              <svg className="h-6 w-6 shrink-0 fill-zinc-400" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.16.65-2.79 1.4-.56.64-1.04 1.74-.91 2.8 1.11.09 2.19-.55 2.76-1.27z" />
              </svg>
              <div className="text-left">
                <span className="block text-[9px] font-medium uppercase tracking-wider text-zinc-400">
                  Download on
                </span>
                <span className="block text-sm font-bold tracking-tight text-zinc-500 leading-tight">
                  App Store
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                Coming April
              </span>
              <span className="block font-mono text-[10px] font-medium text-zinc-500">
                {isClient
                  ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`
                  : "--d --h --m --s"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}