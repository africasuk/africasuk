import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, FileText, Scale, ShieldAlert, ShieldCheck } from "lucide-react";

import {
  defaultLocale,
  getDictionary,
  getDirection,
  type Locale,
} from "@africasuk/i18n";
import InteractiveSearchWrapper from "./InteractiveSearchWrapper";
import LanguageSwitcher from "@/components/layout/header/LanguageSwitcher";



export default async function PrivacyPolicyPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value as Locale) ?? defaultLocale;

  const d = getDictionary(locale);
  const direction = getDirection(locale);
  const isRtl = direction === "rtl";

  return (
    <div 
      dir={direction} 
      className="min-h-screen bg-neutral-50 text-neutral-900 antialiased select-text transition-all duration-200"
    >
      {/* 1. HERO HEADER BANNER BLOCK */}
      <section className="relative w-full bg-neutral-100 border-b border-neutral-200/60 overflow-hidden py-16 lg:py-24">
        <div 
          className="absolute right-0 top-0 bottom-0 bg-[#004d26]/5 hidden lg:block w-1/2"
          style={{
            clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)"
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-3 justify-start">
              <span className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
                LEGAL FRAMEWORK
              </span>
              <div className="h-px w-5 bg-neutral-300" />
              <span className="text-[9px] font-bold tracking-wide text-[#72a134] uppercase">
                {d.common.brandName}
              </span>
            </div>

            <span className="text-[9px] font-bold uppercase tracking-widest text-[#72a134] mb-1 block">
              Security & Trust
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#004d26] leading-none mb-4">
              {d.privacyPolicy.title}
            </h1>
            
            <p className="text-xs sm:text-sm text-neutral-500 font-bold uppercase tracking-wider">
              {d.privacyPolicy.lastUpdated}
            </p>
          </div>

          {/* Integrated Dynamic Language Switcher Engine */}
          <div className="flex items-center gap-2 rounded-full bg-[#004d26] p-1.5 border border-white/10 shadow-md h-fit w-fit self-start md:self-auto">
            <span className="text-[9px] font-bold tracking-wider text-white/70 uppercase px-2">
              {d.common.language}
            </span>
            <div className="h-3.5 w-px bg-white/20" />
            <LanguageSwitcher />
          </div>
        </div>
      </section>
      {/* 2. DYNAMIC SPLIT VIEWPORT CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT SIDE: MINIMAL ASYMMETRIC STICKY QUICK LINKS NAV */}
          <aside className="hidden lg:col-span-3 lg:block sticky top-24 border-r border-neutral-200/60 pr-6 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-4">
              Document Sections
            </span>
            <nav className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              <a href="#intro" className="flex items-center gap-2 py-2 hover:text-[#004d26] transition-colors">
                <FileText className="h-3.5 w-3.5 text-[#72a134]" /> Overview
              </a>
              <a href="#definitions" className="flex items-center gap-2 py-2 hover:text-[#004d26] transition-colors">
                <Scale className="h-3.5 w-3.5 text-[#72a134]" /> Definitions
              </a>
              <a href="#collection" className="flex items-center gap-2 py-2 hover:text-[#004d26] transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-[#72a134]" /> Data Processing
              </a>
              <a href="#children" className="flex items-center gap-2 py-2 hover:text-[#004d26] transition-colors">
                <ShieldAlert className="h-3.5 w-3.5 text-[#72a134]" /> Children&apos;s Safety
              </a>
            </nav>
          </aside>

          {/* RIGHT SIDE: INTERACTIVE REAL-TIME SEARCH WRAPPER */}
          <main className="col-span-1 lg:col-span-9 space-y-12 max-w-none text-neutral-700">
            <InteractiveSearchWrapper d={d} isRtl={isRtl} />
            
            {/* Verification Footer Section */}
            <footer className="bg-neutral-100 border border-neutral-200/60 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-12">
              <div className="max-w-md">
                <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 mb-1">
                  {d.privacyPolicy.contactUs.title}
                </h2>
                <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                  {d.privacyPolicy.contactUs.description}
                </p>
              </div>
              
              <Link 
                href={`https://${d.privacyPolicy.contactUs.methods.website}`}
                target="_blank"
                className="inline-flex items-center gap-2 bg-[#004d26] hover:bg-[#003b1d] text-white font-black text-[10px] uppercase tracking-widest py-3 px-6 rounded-xl shadow-xs active:scale-98 transition-transform cursor-pointer shrink-0"
              >
                <span>Get In Touch</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}