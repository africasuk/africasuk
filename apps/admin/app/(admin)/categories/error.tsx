"use client";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <h2 className="text-2xl font-bold">
        Something went wrong
      </h2>

      <p className="max-w-md text-muted-foreground">
        {error.message ||
          "An unexpected error occurred while loading categories."}
      </p>

      <Button onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}