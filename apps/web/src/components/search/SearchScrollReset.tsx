"use client";

import { useEffect } from "react";

interface Props {
  query?: string;
}

export default function SearchScrollReset({ query }: Props) {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [query]);

  return null;
}