"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = useState("");

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const search = query.trim();

    if (!search) return;

    router.push(
      `/search?q=${encodeURIComponent(search)}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-3xl items-center rounded-xl border bg-background shadow-sm"
    >
      <input
        type="text"
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        placeholder="Search products, brands, categories..."
        className="h-12 flex-1 rounded-l-xl bg-transparent px-4 outline-none"
      />

      <button
        type="submit"
        className="flex h-12 w-14 items-center justify-center rounded-r-xl bg-primary text-primary-foreground transition hover:opacity-90"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}