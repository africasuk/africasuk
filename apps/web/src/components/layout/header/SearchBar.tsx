"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ProductWithDetails } from "@africasuk/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  categories?: never;
}

export default function SearchBar({}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(
    searchParams.get("q") ?? ""
  );
  const [suggestions, setSuggestions] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        formRef.current &&
        !formRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSuggestions = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}`
      );

      if (!res.ok) {
        setSuggestions([]);
        return;
      }

      const text = await res.text();

      if (!text) {
        setSuggestions([]);
        return;
      }

      const data = JSON.parse(text);

      setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const trimmed = inputValue.trim();

    const timer = setTimeout(() => {
      if (trimmed) {
        fetchSuggestions(trimmed);

        router.replace(`/search?q=${encodeURIComponent(trimmed)}`, {
          scroll: false,
        });
      } else if (pathname.startsWith("/search")) {
        router.replace("/products", {
          scroll: false,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, fetchSuggestions, router, pathname]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const search = inputValue.trim();

    if (!search) return;

    setSuggestions([]);

    const params = new URLSearchParams();
    params.set("q", search);

    router.push(`/search?${params.toString()}`);
  }

  function handleClear() {
    setInputValue("");
    setSuggestions([]);
    inputRef.current?.focus();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="group relative flex h-11 w-full items-center rounded-full border border-gray-200 bg-gray-50/80 shadow-2xs transition-all duration-300 hover:border-gray-300 focus-within:border-[#002b15] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#002b15]/20"
    >
      {/* Search Icon */}
      <div className="pointer-events-none absolute left-4 flex items-center text-gray-400 transition-colors duration-200 group-focus-within:text-[#002b15]">
        <Search className="h-4 w-4 stroke-[2.2]" />
      </div>

      {/* Search Input */}
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search products, categories, and brands..."
        aria-label="Search products, categories, and brands"
        className="h-full w-full border-0 bg-transparent pl-11 pr-24 text-xs font-medium text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:ring-0 sm:text-sm"
      />

      {/* Actions */}
      <div className="absolute right-1 flex items-center gap-1">
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin text-[#002b15]" />
        )}

        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="cursor-pointer p-1.5 text-gray-400 transition-colors hover:text-gray-700"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <Button
          type="submit"
          size="sm"
          className="h-9 cursor-pointer rounded-full bg-[#002b15] px-4 text-xs font-bold text-white transition-all duration-200 hover:bg-[#002b15]/90 active:scale-95"
        >
          Search
        </Button>
      </div>

      {/* Search Suggestions */}
      {(suggestions.length > 0 ||
        (Boolean(inputValue.trim()) && loading)) && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="max-h-72 divide-y divide-gray-50 overflow-y-auto">
            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setSuggestions([]);
                  router.push(`/products/${product.slug}`);
                }}
                className="flex w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {product.name}
                  </p>

                  {product.category && (
                    <p className="text-xs text-gray-500">
                      {product.category.name}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}