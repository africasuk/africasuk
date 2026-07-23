"use client";

import { useEffect } from "react";

import ErrorState from "@/components/shared/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      title="Failed to load brands"
      description={error.message}
      onRetry={reset}
    />
  );
}