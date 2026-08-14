"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const search = query.trim();
    if (!search) return;

    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-3xl items-center rounded-none border border-gray-200 bg-white shadow-none transition-colors focus-within:border-[#004d26]"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands, categories..."
        className="h-10 sm:h-11 flex-1 rounded-none bg-transparent px-3.5 sm:px-4 text-xs sm:text-sm font-normal text-gray-900 placeholder:text-gray-400 outline-none"
      />

      <button
        type="submit"
        aria-label="Search"
        className="flex h-10 sm:h-11 w-10 sm:w-12 items-center justify-center rounded-none bg-[#004d26] text-white transition-colors hover:bg-[#00361a] cursor-pointer shrink-0"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}