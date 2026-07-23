import Link from "next/link";
import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 text-center">
      <div className="rounded-full bg-muted p-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>

      <h2 className="mt-6 text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Button
          asChild
          className="mt-6"
        >
          <Link href={actionHref}>
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}