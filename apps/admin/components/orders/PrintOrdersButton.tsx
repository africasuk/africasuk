
"use client";

import { Button } from "@/components/ui/button";

export default function PrintOrdersButton() {
  return (
    <Button onClick={() => window.print()}>
      Print / Save PDF
    </Button>
  );
}
