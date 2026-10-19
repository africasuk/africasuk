
"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Search, X, Loader2 } from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import type { ProductWithDetails } from "@africasuk/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  categories?: never;
  mobileExpanded?: boolean;
  onMobileExpandedChange?: (expanded: boolean) => void;
}

function extractProducts(data: unknown): ProductWithDetails[] {
  if (Array.isArray(data)) {
    return data as ProductWithDetails[];
  }

  if (!data || typeof data !== "object") {
    return [];
  }

  const response = data as Record<string, unknown>;

  for (const key of ["products", "data", "results", "items"]) {
    const value = response[key];

    if (Array.isArray(value)) {
      return value as ProductWithDetails[];
    }

    if (value && typeof value === "object") {
      const nested = value as Record<string, unknown>;

      for (const nestedKey of ["products", "results", "items"]) {
        if (Array.isArray(nested[nestedKey])) {
          return nested[nestedKey] as ProductWithDetails[];
        }
      }
    }
  }

  return [];
}

export default function SearchBar({
  mobileExpanded = false,
  onMobileExpandedChange,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);

  const [inputValue, setInputValue] = useState(
    () => searchParams.get("q") ?? ""
  );
  const [suggestions, setSuggestions] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestionSelected, setSuggestionSelected] = useState(false);

  // Preserve responsive desktop search sizing.
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 70);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close suggestions when the user clicks outside the search form.
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (formRef.current && !formRef.current.contains(target)) {
        requestIdRef.current += 1;
        setSuggestions([]);
        setLoading(false);
        setIsFocused(false);
        onMobileExpandedChange?.(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [onMobileExpandedChange]);

  // Fetch product suggestions from the existing web API.
  const fetchSuggestions = useCallback(async (query: string) => {
    const requestId = ++requestIdRef.current;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(`Search request failed: ${response.status}`);
      }

      const data: unknown = await response.json();

      // Ignore responses belonging to older queries.
      if (requestId !== requestIdRef.current) return;

      setSuggestions(extractProducts(data));
    } catch (error) {
      if (requestId === requestIdRef.current) {
        console.error("Search suggestions failed:", error);
        setSuggestions([]);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Show live suggestions as the user types.
  useEffect(() => {
    const query = inputValue.trim();

    if (!query || suggestionSelected) {
      return;
    }

    const timer = window.setTimeout(() => {
      void fetchSuggestions(query);

      // Keep the URL synchronized when already on the search page.
      if (pathname.startsWith("/search")) {
        router.replace(`/search?q=${encodeURIComponent(query)}`, {
          scroll: false,
        });
      }
    }, 200);

    return () => window.clearTimeout(timer);
  }, [
    inputValue,
    suggestionSelected,
    fetchSuggestions,
    pathname,
    router,
  ]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = inputValue.trim();

    if (!query) {
      inputRef.current?.focus();
      setIsFocused(true);
      onMobileExpandedChange?.(true);
      return;
    }

    requestIdRef.current += 1;
    setSuggestionSelected(false);
    setSuggestions([]);
    setLoading(false);
    setIsFocused(false);
    onMobileExpandedChange?.(false);

    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleClear() {
    requestIdRef.current += 1;
    setSuggestionSelected(false);
    setInputValue("");
    setSuggestions([]);
    setLoading(false);
    setIsFocused(true);
    onMobileExpandedChange?.(true);

    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleInputChange(value: string) {
    requestIdRef.current += 1;
    setSuggestionSelected(false);
    setInputValue(value);
    setSuggestions([]);
    setLoading(Boolean(value.trim()));
    setIsFocused(true);
    onMobileExpandedChange?.(true);
  }

  // Selecting a suggestion fills the input without navigating.
  function handleProductSelect(product: ProductWithDetails) {
    requestIdRef.current += 1;

    setSuggestionSelected(true);
    setInputValue(product.name);
    setSuggestions([]);
    setLoading(false);
    setIsFocused(true);

    requestAnimationFrame(() => {
      const input = inputRef.current;

      if (input) {
        input.focus();
        input.setSelectionRange(
          product.name.length,
          product.name.length
        );
      }
    });
  }

  const showSuggestions =
    inputValue.trim().length > 0 &&
    (suggestions.length > 0 || loading);

  return (
    <form
      ref={formRef}
      data-search-container
      onSubmit={handleSubmit}
      onFocus={() => setIsFocused(true)}
      className={[
        "group relative z-50 flex h-10 w-full min-w-0 items-center rounded-full border",
        "transition-all duration-300 ease-out",
        "border-gray-200 bg-gray-50/95 shadow-sm",
        "hover:border-gray-300 focus-within:border-[#002b15]",
        "focus-within:bg-white focus-within:ring-2 focus-within:ring-[#002b15]/15",
        isScrolled ? "md:h-13" : "",
        isFocused ? "bg-white shadow-md" : "",
        mobileExpanded
          ? "h-11 border-[#002b15]/20 bg-white shadow-md"
          : "",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute left-3 flex items-center text-gray-400 transition-colors group-focus-within:text-[#002b15] sm:left-4">
        <Search className="h-4 w-4 shrink-0 stroke-[2.2]" />
      </div>

      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => {
          setIsFocused(true);
          onMobileExpandedChange?.(true);
        }}
        placeholder="Search products..."
        aria-label="Search products, categories, and brands"
        autoComplete="off"
        className="h-full w-full min-w-0 border-0 bg-transparent pl-9 pr-16 text-xs font-medium text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:ring-0 sm:pl-11 sm:pr-24 sm:text-sm"
      />

      <div className="absolute right-1 flex items-center gap-0.5 sm:gap-1">
        {loading && (
          <Loader2
            aria-label="Searching products"
            className="h-3.5 w-3.5 animate-spin text-[#002b15] sm:h-4 sm:w-4"
          />
        )}

        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="cursor-pointer p-1 text-gray-400 transition-colors hover:text-gray-700 sm:p-1.5"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        )}

        <Button
          type="submit"
          size="sm"
          className="h-8 cursor-pointer rounded-full bg-[#002b15] px-2.5 text-[10px] font-bold text-white transition-all hover:bg-[#002b15]/90 active:scale-95 sm:px-4 sm:text-xs"
        >
          Search
        </Button>
      </div>

      {showSuggestions && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
          role="listbox"
          aria-label="Product search suggestions"
        >
          <div className="max-h-80 overflow-y-auto">
            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                role="option"
                aria-selected={false}
                onClick={() => handleProductSelect(product)}
                className="flex w-full items-center gap-3 border-b border-gray-100 p-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {product.name}
                  </p>

                  {product.category?.name && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {product.category.name}
                    </p>
                  )}
                </div>
              </button>
            ))}

            {loading && suggestions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">
                Searching products...
              </div>
            )}

            {!loading &&
              suggestions.length === 0 &&
              inputValue.trim().length > 0 &&
              !suggestionSelected && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No matching products found.
                </div>
              )}
          </div>
        </div>
      )}
    </form>
  );
}
