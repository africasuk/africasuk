"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Category, ProductWithDetails } from "@africasuk/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  categories?: Category[];
}

export default function SearchBar({}: SearchBarProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
const [suggestions, setSuggestions] =
  useState<ProductWithDetails[]>([]);

const [loading, setLoading] =
  useState(false);

  // Close suggestions overlay when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

async function handleSearch(value: string) {
  setQuery(value);

  if (value.trim().length < 2) {
    setSuggestions([]);
    return;
  }

  try {
    setLoading(true);

    const res = await fetch(
      `/api/search?q=${encodeURIComponent(value)}`
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

    setSuggestions(
      Array.isArray(data) ? data : []
    );

  } catch (error) {
    console.error("Search error:", error);
    setSuggestions([]);
  } finally {
    setLoading(false);
  }
}

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const search = query.trim();
    if (!search) return;

    setSuggestions([]);
    const params = new URLSearchParams();
    params.set("q", search);

    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="group relative flex h-11 w-full items-center rounded-full border border-gray-200 bg-gray-50/80 shadow-2xs transition-all duration-300 focus-within:border-[#002b15] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#002b15]/20 hover:border-gray-300"
    >
      {/* Search Icon */}
      <div className="absolute left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#002b15] transition-colors duration-200">
        <Search className="h-4 w-4 stroke-[2.2]" />
      </div>

      {/* Input Field */}
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search products, categories, premium brands..."
        className="h-full w-full border-0 shadow-none focus-visible:ring-0 bg-transparent pl-11 pr-24 text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400"
      />

      {/* Right Action Controls */}
      <div className="absolute right-1 flex items-center gap-1">
        {/* Loading Spinner */}
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin text-[#002b15]" />
        )}

        {/* Clear Text Trigger */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Clear search query"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Submit Action Button */}
        <Button
          type="submit"
          size="sm"
          className="h-9 rounded-full bg-[#002b15] px-4 text-xs font-bold text-white transition-all duration-200 hover:bg-[#002b15]/90 active:scale-95 cursor-pointer"
        >
          Search
        </Button>
      </div>

      {/* Live Search Suggestions Dropdown Overlay */}
      {suggestions.length > 0 && (
        <div className="absolute top-12 left-0 right-0 z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setSuggestions([]);
                  router.push(`/products/${product.slug}`);
                }}
                className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-gray-50/80 cursor-pointer group/item"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 group-hover/item:text-[#002b15] truncate">
                    {product.name}
                  </p>
                    {product.category && (
                      <p className="text-[10px] text-gray-400 font-medium">
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