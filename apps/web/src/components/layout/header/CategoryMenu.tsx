"use client";

import { Grid2x2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function CategoryMenu() {
  return (
    <Button
      variant="ghost"
      className="gap-2"
    >
      <Grid2x2 className="h-4 w-4" />

      All Categories
    </Button>
  );
}