"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-sm text-muted-foreground">
      <Link
        href="/"
        className="flex items-center hover:text-foreground"
      >
        <Home className="mr-1 h-4 w-4" />
        Home
      </Link>

      {segments.map((segment, index) => {
        const href =
          "/" +
          segments
            .slice(0, index + 1)
            .join("/");

        const label =
          segment.charAt(0).toUpperCase() +
          segment.slice(1);

        return (
          <div
            key={href}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />

            <Link
              href={href}
              className="hover:text-foreground"
            >
              {label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}