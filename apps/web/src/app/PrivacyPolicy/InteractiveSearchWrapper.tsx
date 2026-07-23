"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle, Search } from "lucide-react";
import type { Dictionary } from "@africasuk/i18n";

interface SearchWrapperProps {
  d: Dictionary;
  isRtl: boolean;
}

export default function InteractiveSearchWrapper({ d, isRtl }: SearchWrapperProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const cleanQuery = searchQuery.toLowerCase().trim();

  // Filter systems check
  const matchesSearch = (text: string) => {
    if (!cleanQuery) return true;
    return text.toLowerCase().includes(cleanQuery);
  };

  const filteredDefinitions = Object.entries(d.privacyPolicy.interpretationAndDefinitions.definitions.items).filter(
    ([key, value]) => matchesSearch(key) || matchesSearch(value)
  );

  const filteredServices = Object.entries(d.privacyPolicy.detailedProcessing.services).filter(
    ([name, data]) => matchesSearch(name) || matchesSearch(data.description)
  );

  return (
    <div className="space-y-12">
      {/* LIVE FLOATING SEARCH ENGINE INPUT BAR */}
      <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-3">
        <div className="pl-3 text-neutral-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={d.common.search || "Search policies, terms, cookies..."}
          className="w-full bg-transparent py-2 text-sm font-medium text-neutral-900 placeholder-neutral-400 outline-hidden border-none"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-neutral-950 px-3 py-1 cursor-pointer bg-neutral-100 rounded-lg transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* OVERVIEW INTRO SEGMENT */}
      {matchesSearch(d.privacyPolicy.interpretationAndDefinitions.interpretation.text) && (
        <div id="intro" className="space-y-4 text-sm sm:text-base leading-relaxed text-neutral-600 border-b border-neutral-100 pb-8 animate-in fade-in duration-300">
          {d.privacyPolicy.introduction.map((text, idx) => (
            <p key={idx}>{text}</p>
          ))}
          <p className="text-xs text-neutral-400 font-medium italic">
            {d.privacyPolicy.generatorAttribution.text}{" "}
            <a 
              href={d.privacyPolicy.generatorAttribution.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-[#004d26] underline underline-offset-4 hover:text-[#72a134] transition-colors"
            >
              TermsFeed Generator
            </a>.
          </p>
        </div>
      )}

      {/* INTERPRETATION & DEFINITIONS SEGMENT */}
      {filteredDefinitions.length > 0 && (
        <section id="definitions" className="scroll-mt-24 animate-in fade-in duration-300">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#004d26] mb-4">
            {d.privacyPolicy.interpretationAndDefinitions.title}
          </h2>
          
          <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">
            {d.privacyPolicy.interpretationAndDefinitions.interpretation.title}
          </h3>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6">
            {d.privacyPolicy.interpretationAndDefinitions.interpretation.text}
          </p>

          <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4">
            {d.privacyPolicy.interpretationAndDefinitions.definitions.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDefinitions.map(([key, value]) => (
              <div key={key} className="border-l-2 border-neutral-200 pl-4 py-1.5 transition-colors hover:border-[#72a134]">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-1">{key}</h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DATA PROCESSING DATA COLLECTION LOGIC SEGMENT */}
      <section id="collection" className="scroll-mt-24 space-y-8 animate-in fade-in duration-300">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#004d26] mb-4">
            {d.privacyPolicy.collectingAndUsingData.title}
          </h2>
          <h3 className="text-sm font-bold text-neutral-900 mb-2">
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.title}
          </h3>
        </div>
        
        {/* Personal Data Inline Sub-segment */}
        <div className="bg-neutral-100/50 rounded-xl p-6 border border-neutral-200/40">
          <h4 className="text-xs font-black uppercase tracking-widest text-neutral-800 mb-2">
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.personalData.title}
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 mb-4">
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.personalData.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.personalData.items.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 bg-white border border-neutral-200 text-neutral-700 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-md shadow-xs">
                <CheckCircle className="h-3 w-3 text-[#72a134]" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Usage Data Sub-segment */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-neutral-800 mb-2">
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.usageData.title}
          </h4>
          <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed">
            <p>{d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.usageData.description}</p>
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.usageData.details.map((detail, idx) => (
              <p key={idx}>{detail}</p>
            ))}
          </div>
        </div>

        {/* Cookies Block */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-neutral-800 mb-2">
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.trackingTechnologies.title}
          </h4>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.trackingTechnologies.description}
          </p>

          <p className={`bg-white p-4 rounded-xl text-xs sm:text-sm text-neutral-700 font-medium shadow-xs border ${isRtl ? "border-r-4 border-r-[#004d26]" : "border-l-4 border-l-[#004d26]"}`}>
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.trackingTechnologies.consentNotice}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {d.privacyPolicy.collectingAndUsingData.typesOfDataCollected.trackingTechnologies.cookieList.map((cookie, idx) => (
              <div key={idx} className="bg-white border border-neutral-200/80 p-5 rounded-xl shadow-xs flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-1">{cookie.name}</h5>
                  <span className="text-[9px] font-bold text-neutral-400 tracking-wide block mb-3 uppercase">
                    {cookie.type}
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed">{cookie.purpose}</p>
                </div>
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#72a134] mt-4 block">
                  Admin: {cookie.administeredBy}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Table Section */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-neutral-800 mb-1">
            {d.privacyPolicy.collectingAndUsingData.retention.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {d.privacyPolicy.collectingAndUsingData.retention.generalPolicy}
          </p>
          
          <div className="overflow-x-auto border border-neutral-200/60 rounded-xl bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-200 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  <th className="p-4">Data Category</th>
                  <th className="p-4">Retention Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-600 font-medium">
                {Object.entries(d.privacyPolicy.collectingAndUsingData.retention.categories).map(([category, items]) => (
                  <tr key={category} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="p-4 font-bold text-neutral-900">{category}</td>
                    <td className="p-4">
                      {Object.entries(items).map(([subKey, subVal]) => (
                        <div key={subKey}>{subVal}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PROCESSING SYSTEMS SECTION */}
      {filteredServices.length > 0 && (
        <section className="space-y-4 animate-in fade-in duration-300">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#004d26]">
            {d.privacyPolicy.detailedProcessing.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600">{d.privacyPolicy.detailedProcessing.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map(([serviceName, serviceData]) => (
              <div key={serviceName} className="bg-white border border-neutral-200 p-5 rounded-xl shadow-xs flex flex-col justify-between items-start">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-900 mb-1.5">{serviceName}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-4">{serviceData.description}</p>
                </div>
                <a 
                  href={serviceData.policyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 group text-[10px] font-black uppercase tracking-widest text-[#004d26] hover:text-[#72a134] transition-colors"
                >
                  <span>View Google Policy</span>
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CHILDREN SECTION */}
      <section id="children" className="scroll-mt-24 border-t border-neutral-200/60 pt-8 animate-in fade-in duration-300">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#004d26] mb-3">
          {d.privacyPolicy.childrensPrivacy.title}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
          {d.privacyPolicy.childrensPrivacy.text}
        </p>
      </section>
    </div>
  );
}