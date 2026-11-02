"use client";

import { Check, ChevronDown, Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useCurrency } from "@/providers/CurrencyProvider";

const CURRENCIES = {
  USD: {
    label: "USD",
    name: "US Dollar",
    flag: "🇺🇸",
  },
  SSP: {
    label: "SSP",
    name: "South Sudanese Pound",
    flag: "🇸🇸",
  },
} as const;

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  const activeCurrency = CURRENCIES[currency];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-9 items-center gap-2 rounded-lg border bg-background px-2.5 text-xs font-semibold transition-colors hover:bg-muted sm:h-10"
        aria-label="Select currency"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />

        <span className="hidden sm:inline">
          {activeCurrency.flag}
        </span>

        <span>{activeCurrency.label}</span>

        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {(Object.keys(CURRENCIES) as Array<keyof typeof CURRENCIES>).map(
          (code) => {
            const item = CURRENCIES[code];
            const active = currency === code;

            return (
              <DropdownMenuItem
                key={code}
                onClick={() => setCurrency(code)}
                className="flex cursor-pointer items-center justify-between py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span>{item.flag}</span>

                  <div className="flex flex-col">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                </div>

                {active && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            );
          }
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}