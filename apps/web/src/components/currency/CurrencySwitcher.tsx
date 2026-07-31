"use client";

import { Check, ChevronDown, Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "providers/CurrencyProvider";

// High-fidelity SVG vectors instead of OS-dependent emoji characters
const CURRENCIES = {
  USD: { 
    label: "USD", 
    fullName: "US Dollar",
    renderFlag: () => (
      <svg className="h-3 w-4.5 rounded-xs object-cover shrink-0 shadow-3xs" viewBox="0 0 741 390">
        <rect width="741" height="390" fill="#b31942"/>
        <path d="M0,30h741M0,90h741M0,150h741M0,210h741M0,270h741M0,330h741" stroke="#fff" strokeWidth="30"/>
        <rect width="296" height="210" fill="#0c2340"/>
        <path d="M0,0 L296,210 M0,210 L296,0" stroke="#fff" strokeWidth="2" opacity="0.3"/>
      </svg>
    )
  },
  SSP: { 
    label: "SSP", 
    fullName: "South Sudanese Pound",
    renderFlag: () => (
      <svg className="h-3 w-4.5 rounded-xs object-cover shrink-0 shadow-3xs" viewBox="0 0 1200 600">
        <rect width="1200" height="600" fill="#000"/>
        <rect y="200" width="1200" height="200" fill="#c8102e"/>
        <rect y="400" width="1200" height="200" fill="#00843d"/>
        <path d="M0,160h1200M0,440h1200" stroke="#fff" strokeWidth="40"/>
        <polygon points="0,0 400,300 0,600" fill="#002f6c"/>
        <polygon points="100,300 160,345 135,275 195,230 120,230" fill="#eaaa00" transform="translate(-25, 0) scale(1.2) rotate(-15 135 275)"/>
      </svg>
    )
  },
} as const;

type CurrencyCode = keyof typeof CURRENCIES;

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  const activeCode = (currency in CURRENCIES ? currency : "USD") as CurrencyCode;
  const activeCurrency = CURRENCIES[activeCode];

  return (
    <DropdownMenu>
          <DropdownMenuTrigger
            className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-left text-gray-700 hover:text-[#002b15] hover:border-gray-300 transition-all duration-200 focus:outline-none select-none cursor-pointer text-xs font-semibold shadow-2xs min-w-22.5 xs:min-w-[105px]"
          >
          <Globe className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#002b15] transition-colors shrink-0" />
          
          {/* Label Display */}
          <div className="flex flex-col flex-1 leading-tight">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-500 block">
              Currency
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              {activeCurrency.renderFlag()}
              <span className="text-[11px] font-black tracking-wide text-gray-900">
                {activeCurrency.label}
              </span>
            </div>
          </div>

          <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" />
       </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-45 z-50 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-lg antialiased select-none"
      >
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
          const item = CURRENCIES[code];
          const isActive = activeCode === code;

          return (
            <DropdownMenuItem
              key={code}
              onClick={() => setCurrency(code)}
              className={`flex items-center justify-between gap-3 cursor-pointer rounded-xl px-2.5 py-2 text-xs font-bold transition-colors outline-none ${
                isActive 
                  ? "bg-gray-50 text-[#002b15]" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.renderFlag()}
                <div className="flex flex-col">
                  <span className="text-gray-900 font-black">{item.label}</span>
                  <span className="text-[9px] font-medium text-gray-400 normal-case">{item.fullName}</span>
                </div>
              </div>
              {isActive && <Check className="h-3.5 w-3.5 text-[#002b15] shrink-0 stroke-3" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}