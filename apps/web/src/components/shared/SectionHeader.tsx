import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}